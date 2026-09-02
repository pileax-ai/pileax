from pydantic import TypeAdapter

from app.api.models.llm import LLM
from app.api.models.provider import LLMInfo, LLMInfoDetails
from app.api.repos.llm_repository import LLMRepository
from app.api.services.base_service import BaseService
from app.api.services.llm_provider_service import LLMProviderService
from app.api.services.workspace_llm_service import WorkspaceLLMService

LLM_INFO_ADAPTER = TypeAdapter(list[LLMInfo])


class LLMService(BaseService[LLM]):
    def __init__(self, session):
        super().__init__(LLM, session, LLMRepository)
        self.llm_provider_service = LLMProviderService(session)
        self.workspace_llm_service = WorkspaceLLMService(session)

    def find_all_by_providers(self, providers: list) -> list[LLMInfoDetails]:
        models = self.repo.find_all_by_providers(providers)
        return [LLMInfoDetails(**(item)) for item in models]

    def sync_model(self, data: dict):
        obj = super().find_one({"provider": data["provider"], "model_name": data["model_name"]})
        if obj:
            super().update(obj.id, data)
        else:
            super().create(LLM(**data), True)
