from typing import Optional
from uuid import UUID

from app.api.models.query import PaginationQuery
from app.api.models.tenant_member import TenantMember, TenantMemberCreate, TenantMemberUpdate
from app.api.services.tenant_member_service import TenantMemberService


class TenantMemberController:
    def __init__(self, session, user_id: Optional[str] = None, tenant_id: Optional[str] = None):
        self.service = TenantMemberService(session)
        self.tenant_id = tenant_id

    def get_details(self, id: UUID):
        return self.service.get_details(id)

    def query_details(self, query: PaginationQuery):
        query.condition.setdefault("tenant_id", self.tenant_id)
        return self.service.query_details(query)
