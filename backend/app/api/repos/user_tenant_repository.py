import uuid
from typing import List

from sqlalchemy import func
from sqlalchemy.util import deprecated
from sqlmodel import select
from uuid import UUID

from app.api.models.enums import Status
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.tenant import Tenant
from app.api.models.tenant_member import TenantMember
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class UserTenantRepository(BaseRepository[TenantMember]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_user_tenants(self, user_id: uuid.UUID) -> List[Tenant]:
        stmt = (
            select(Tenant)
            .join(TenantMember, TenantMember.tenant_id == Tenant.id)
            .where(
                TenantMember.user_id == user_id,
                Tenant.status == Status.ACTIVE
            )
        )
        tenants: List[Tenant] = list(self.session.exec(stmt).all())
        return tenants

    @deprecated
    def get_details(self, id: UUID) -> dict | None:
        stmt = (
            select(TenantMember, Tenant)
            .join(Tenant, Tenant.id == TenantMember.tenant_id)
            .where(TenantMember.id == id)
        )
        result = self.session.exec(stmt).first()
        if result:
            tenant_member, tenant = result
            return self._build_details(tenant_member, tenant)
        return None

    @deprecated
    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filter_mapping = {
            TenantMember: ['tenant_id', 'user_id'],
            Tenant: ['name', 'plan', 'type'],
        }
        filters = DbHelper.build_filters(filter_mapping, query.condition)

        # 2. stmt
        stmt = (select(TenantMember, Tenant)
            .join(Tenant, Tenant.id == TenantMember.tenant_id)
        )
        count_stmt = (select(func.count())
            .select_from(TenantMember)
            .join(Tenant, Tenant.id == TenantMember.tenant_id)
        )

        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [TenantMember, Tenant], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)

        # 5. Query
        total = self.session.exec(count_stmt).one()
        rows = [
            self._build_details(tenant_member, tenant)
            for tenant_member, tenant in self.session.exec(stmt).all()
        ]

        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    def _build_details(self, tenant_member: TenantMember, tenant: Tenant) -> dict:
        return {
            **tenant_member.model_dump(),
            "name": tenant.name,
            "plan": tenant.plan,
            "type": tenant.type,
        }
