from uuid import UUID

from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.query import PaginationQuery
from app.api.services.tenant_member_service import TenantMemberService


class TenantMemberController:
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        self.service = TenantMemberService(session)
        self.tenant_id = tenant_id

    def get_details(self, id: UUID):
        return self.service.get_details(id)

    def query_details(self, query: PaginationQuery):
        query.condition.setdefault("tenant_id", self.tenant_id)
        return self.service.query_details(query)
