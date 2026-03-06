import uuid

from app.api.models.tenant import Tenant, TenantPlan, TenantType
from app.api.models.user import User
from app.api.repos.base_repository import BaseRepository
from app.api.services.base_service import BaseService
from app.libs.crypto.key_manager import generate_rsa_keypair


class TenantService(BaseService[Tenant]):
    def __init__(self, session):
        super().__init__(Tenant, session, BaseRepository)

    def create_default(self, user: User) -> Tenant:
        tenant_id = uuid.uuid4()
        public_key = generate_rsa_keypair(str(tenant_id))
        tenant = Tenant(
            id=tenant_id,
            user_id=user.id,
            name=user.name,
            type=TenantType.PERSONAL,
            plan=TenantPlan.BASIC,
            public_key=public_key,
        )
        return self.create(tenant)

    def get_public_key(self, tenant_id: uuid.UUID) -> str:
        tenant = super().get(tenant_id)
        public_key = tenant.public_key
        if public_key is None or len(public_key) == 0:
            public_key = self.update_public_key(tenant.id)

        return public_key

    def update_public_key(self, tenant_id: uuid.UUID) -> str:
        public_key = generate_rsa_keypair(str(tenant_id))
        self.update(tenant_id, {"public_key": public_key})
        return public_key
