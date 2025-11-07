import uuid
from typing import Any

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.tenant import Tenant, TenantCreate, TenantUpdate
from app.api.services.tenant_service import TenantService


class TenantController(BaseController[Tenant, TenantCreate, TenantUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(Tenant, session, tenant_id, user_id)
        self.service = TenantService(session)

    def get_user_tenants(self) -> Any:
        return self.service.get_user_tenants(self.user_id)
