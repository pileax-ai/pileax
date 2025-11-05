from sqlalchemy import func
from sqlmodel import select
from uuid import UUID

from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user import User
from app.api.models.tenant_member import TenantMember
from app.api.repos.base_repository import BaseRepository
from app.utils.db_util import DbUtil


class TenantMemberRepository(BaseRepository[TenantMember]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_details(self, id: UUID) -> dict | None:
        stmt = (
            select(TenantMember, User)
            .join(User, User.id == TenantMember.user_id)
            .where(TenantMember.id == id)
        )
        result = self.session.exec(stmt).first()
        if result:
            user_book, book = result
            return self._build_details(user_book, book)
        return None

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        tenant_member_filters = DbUtil.get_filters(TenantMember, query.condition, ['user_id'])
        user_filters = DbUtil.get_filters(User, query.condition, ['name'])
        filters = tenant_member_filters + user_filters

        # 2. stmt
        stmt = (
            select(TenantMember, User)
            .join(User, User.id == TenantMember.user_id)
        )
        count_stmt = (
            select(func.count())
            .select_from(TenantMember)
            .join(User, User.id == TenantMember.user_id)
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        for field, direction in query.sort.items():
            if hasattr(TenantMember, field):
                column = getattr(TenantMember, field)
            elif hasattr(User, field):
                column = getattr(User, field)
            else:
                continue
            stmt = stmt.order_by(column.desc() if direction == "desc" else column.asc())

        # 4. Pagination
        offset = (query.pageIndex - 1) * query.pageSize
        stmt = stmt.offset(offset).limit(query.pageSize)

        # 5. Query
        # 5.1 Total
        total = self.session.exec(count_stmt).one()

        # 5.2 Rows
        result = self.session.exec(stmt)
        pairs = result.all()
        rows = [
            self._build_details(tenant_member, user)
            for tenant_member, user in pairs
        ]
        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    def _build_details(self, tenant_member: TenantMember, user: User) -> dict:
        return {
            **tenant_member.model_dump(),
            "user_name": user.name,
            "user_email": user.email,
            "last_active_time": user.last_active_time,
        }
