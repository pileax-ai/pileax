from sqlalchemy import func
from sqlmodel import select
from uuid import UUID

from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user import User
from app.api.models.workspace_member import WorkspaceMember
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class WorkspaceMemberRepository(BaseRepository[WorkspaceMember]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_details(self, id: UUID) -> dict | None:
        stmt = (
            select(WorkspaceMember, User)
            .join(User, User.id == WorkspaceMember.user_id)
            .where(WorkspaceMember.id == id)
        )
        result = self.session.exec(stmt).first()
        if result:
            tenant_member, user = result
            return self._build_details(tenant_member, user)
        return None

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filter_mapping = {
            WorkspaceMember: ['tenant_id', 'user_id'],
            User: ['name'],
        }
        filters = DbHelper.build_filters(filter_mapping, query.condition)

        # 2. stmt
        stmt = (select(WorkspaceMember, User)
            .join(User, User.id == WorkspaceMember.user_id)
        )
        count_stmt = (select(func.count())
            .select_from(WorkspaceMember)
            .join(User, User.id == WorkspaceMember.user_id)
        )

        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [WorkspaceMember, User], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)

        # 5. Query
        total = self.session.exec(count_stmt).one()
        rows = [
            self._build_details(tenant_member, user)
            for tenant_member, user in self.session.exec(stmt).all()
        ]

        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    def _build_details(self, tenant_member: WorkspaceMember, user: User) -> dict:
        return {
            **tenant_member.model_dump(),
            "user_name": user.name,
            "user_email": user.email,
            "last_active_time": user.last_active_time,
        }
