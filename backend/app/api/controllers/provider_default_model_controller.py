from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.provider_default_model import (
    ProviderDefaultModel,
    ProviderDefaultModelCreate,
    ProviderDefaultModelUpdate,
)
from app.api.services.provider_default_model_service import ProviderDefaultModelService


class ProviderDefaultModelController(
    BaseController[ProviderDefaultModel, ProviderDefaultModelCreate, ProviderDefaultModelUpdate]
):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(ProviderDefaultModel, session, user, workspace)
        self.service = ProviderDefaultModelService(session, user.id, workspace.id)

    def save(self, item_in: ProviderDefaultModelCreate) -> ProviderDefaultModel:
        return self.service.create_update(item_in)

    def find_all(self) -> list[ProviderDefaultModel]:
        return self.service.find_all({"workspace_id": self.workspace_id})

    def get_by_type(self, model_type: str) -> ProviderDefaultModel:
        return self.service.get_by_type(model_type)
