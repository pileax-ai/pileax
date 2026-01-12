from app.api.deps import CurrentUserId, CurrentWorkspace, SessionDep
from app.api.services.provider_service import ProviderService


class ProviderModelController:
    def __init__(self, session: SessionDep, user_id: CurrentUserId, workspace: CurrentWorkspace):
        self.user_id = user_id
        self.workspace = workspace
        self.service = ProviderService(session)

    def find_all(self):
        return self.service.find_all_model(self.workspace.id)

    def find_by_type(self, model_type: str):
        models = self.service.find_model_by_type(self.workspace.id, model_type)
        return models
