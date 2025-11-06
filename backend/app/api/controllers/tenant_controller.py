import uuid
from typing import Optional, Any

from app.api.controllers.base_controller import BaseController
from app.api.models.tenant import Tenant, TenantCreate, TenantUpdate
from app.api.services.tenant_service import TenantService


class TenantController(BaseController[Tenant, TenantCreate, TenantUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(Tenant, session, user_id)
        self.service = TenantService(session)

    def get_user_tenants(self, user_id: uuid.UUID) -> Any:
        return self.service.get_user_tenants(user_id)
