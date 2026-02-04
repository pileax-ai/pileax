from app.api.deps import CurrentWorkspace, SessionDep
from app.api.models.provider import ProviderInfo
from app.api.services.llm_service import LLMService


class LLMController:
    def __init__(self, session: SessionDep, workspace: CurrentWorkspace):
        self.workspace = workspace
        self.service = LLMService(session, workspace)

    def get_providers(self) -> list[ProviderInfo]:
        return self.service.get_providers()

    def get_provider(self, provider_id: str) -> ProviderInfo:
        return self.service.get_provider(provider_id)
