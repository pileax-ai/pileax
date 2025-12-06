from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspace
from app.api.services.provider_service import ProviderService


class ProviderModelController:
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace: CurrentWorkspace
    ):
        self.user_id = user_id
        self.workspace = workspace
        self.service = ProviderService(session)

    def find_all(self):
        return self.service.find_all_model(self.workspace.tenant_id)

    def find_by_type(self, model_type: str):
        models = self.service.find_model_by_type(self.workspace.tenant_id, model_type)
        return models
