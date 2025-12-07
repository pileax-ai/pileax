from typing import List

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspace
from app.api.models.tenant_default_model import TenantDefaultModel, TenantDefaultModelCreate, TenantDefaultModelUpdate
from app.api.services.tenent_default_model_service import TenantDefaultModelService


class TenantDefaultModelController(BaseController[TenantDefaultModel, TenantDefaultModelCreate, TenantDefaultModelUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace: CurrentWorkspace
    ):
        super().__init__(TenantDefaultModel, session, workspace.id, user_id)
        self.service = TenantDefaultModelService(session, workspace.tenant_id, user_id)
        self.workspace = workspace

    def save(self, item_in: TenantDefaultModelCreate) -> TenantDefaultModel:
        return self.service.create_update(item_in, self.workspace_id)

    def find_all(self) -> List[TenantDefaultModel]:
        return self.service.find_all({
            'tenant_id': self.workspace.tenant_id
        })

    def get_by_type(self, model_type: str) -> TenantDefaultModel:
        return self.service.get_by_type(self.workspace_id, model_type)
