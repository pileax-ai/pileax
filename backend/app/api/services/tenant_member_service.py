from app.api.models.tenant_member import TenantMember
from app.api.models.query import PaginationQuery
from app.api.repos.tenant_member_repository import TenantMemberRepository
from app.api.services.base_service import BaseService

class TenantMemberService(BaseService[TenantMember]):
    def __init__(self, session):
        super().__init__(TenantMember, session, TenantMemberRepository)

    def query_details(self, query: PaginationQuery):
        return self.repo.query_details(query)
