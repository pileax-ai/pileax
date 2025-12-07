from typing import List

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspaceId
from app.api.models.provider_default_model import ProviderDefaultModel, ProviderDefaultModelCreate, ProviderDefaultModelUpdate
from app.api.services.provider_model_service import ProviderDefaultModelService


class ProviderDefaultModelController(BaseController[ProviderDefaultModel, ProviderDefaultModelCreate, ProviderDefaultModelUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId
    ):
        super().__init__(ProviderDefaultModel, session, user_id, workspace_id)
        self.service = ProviderDefaultModelService(session, workspace_id, user_id)
        self.workspace_id = workspace_id

    def save(self, item_in: ProviderDefaultModelCreate) -> ProviderDefaultModel:
        return self.service.create_update(item_in, self.workspace_id)

    def find_all(self) -> List[ProviderDefaultModel]:
        return self.service.find_all({
            'workspace_id': self.workspace_id
        })

    def get_by_type(self, model_type: str) -> ProviderDefaultModel:
        return self.service.get_by_type(self.workspace_id, model_type)
