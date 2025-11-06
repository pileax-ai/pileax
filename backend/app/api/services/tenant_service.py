import uuid
from typing import List

from app.api.models.tenant import Tenant, TenantPlan, TenantType
from app.api.models.tenant_member import TenantMember, TenantMemberRole
from app.api.models.user import User
from app.api.repos.base_repository import BaseRepository
from app.api.repos.user_tenant_repository import UserTenantRepository
from app.api.services.base_service import BaseService
from app.api.services.tenant_member_service import TenantMemberService


class TenantService(BaseService[Tenant]):
    def __init__(self, session):
        super().__init__(Tenant, session, BaseRepository)

    def create_default(self, user: User) -> TenantMember:
        # Tenant, user user id as id
        tenant = Tenant(
            id=user.id,
            name=user.name,
            type=TenantType.PERSONAL,
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

    def get_user_tenants(self, user_id: uuid.UUID) -> List[Tenant]:
        return UserTenantRepository(Tenant, self.session).get_user_tenants(user_id)
