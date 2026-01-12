from app.api.models.tenant import Tenant, TenantPlan, TenantType
from app.api.models.user import User
from app.api.repos.base_repository import BaseRepository
from app.api.services.base_service import BaseService


class TenantService(BaseService[Tenant]):
    def __init__(self, session):
        super().__init__(Tenant, session, BaseRepository)

    def create_default(self, user: User) -> Tenant:
        tenant = Tenant(
            user_id=user.id,
            name=user.name,
            type=TenantType.PERSONAL,
            plan=TenantPlan.BASIC,
        )
        return self.create(tenant)
