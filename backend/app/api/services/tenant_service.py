from app.api.models.tenant import Tenant, TenantPlan
from app.api.models.tenant_member import TenantMember, TenantMemberRole
from app.api.models.user import User
from app.api.repos.base_repository import BaseRepository
from app.api.services.base_service import BaseService
from app.api.services.tenant_member_service import TenantMemberService


class TenantService(BaseService[Tenant]):
    def __init__(self, session):
        super().__init__(Tenant, session, BaseRepository)

    def create_default(self, user: User) -> TenantMember:
        # Tenant
        tenant = Tenant(
            name=user.name,
            plan=TenantPlan.BASIC,
        )
        tenant = self.create(tenant)

        # Todo: Tenant public key

        # Tenant member
        tenant_member = TenantMember(
            user_id=user.id,
            tenant_id=tenant.id,
            role=TenantMemberRole.OWNER,
            invited_by=user.id,
        )

        return TenantMemberService(self.session).create(tenant_member)
