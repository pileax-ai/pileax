from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.llm_provider import LLMProvider, LLMProviderCreate, LLMProviderModels, LLMProviderUpdate
from app.api.services.llm_provider_service import LLMProviderService
from app.libs.provider_helper import ProviderHelper


class LLMProviderController(BaseController[LLMProvider, LLMProviderCreate, LLMProviderUpdate]):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(LLMProvider, session, user, workspace)
        self.service = LLMProviderService(session)

    def find_providers(self) -> list[LLMProviderModels]:
        return self.service.find_all_providers(self.workspace_id)

    def update_online(self) -> bool:
        return ProviderHelper.update_online()
