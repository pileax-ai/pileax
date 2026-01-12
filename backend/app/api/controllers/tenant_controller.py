from typing import Any

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspaceId, SessionDep
from app.api.models.tenant import Tenant, TenantCreate, TenantUpdate
from app.api.services.tenant_service import TenantService


class TenantController(BaseController[Tenant, TenantCreate, TenantUpdate]):
    def __init__(self, session: SessionDep, user_id: CurrentUserId, workspace_id: CurrentWorkspaceId):
        super().__init__(Tenant, session, user_id, workspace_id)
        self.service = TenantService(session, user_id)

    def get_user_workspaces(self) -> Any:
        return self.service.get_user_workspaces(self.user_id)

    def save(self, item_in: TenantCreate) -> Tenant:
        return self.service.save(item_in)
