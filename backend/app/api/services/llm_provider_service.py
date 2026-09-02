from app.api.models.enums import Status
from app.api.models.llm import LLMPublic
from app.api.models.llm_provider import LLMProvider, LLMProviderModels, LLMProviderPublicCount
from app.api.repos.llm_provider_repository import LLMProviderRepository
from app.api.services.base_service import BaseService
from app.api.services.workspace_llm_service import WorkspaceLLMService


class LLMProviderService(BaseService[LLMProvider]):
    def __init__(self, session):
        super().__init__(LLMProvider, session, LLMProviderRepository)
        self.wls = WorkspaceLLMService(session)

    def find_all_with_count(self) -> list[LLMProviderPublicCount]:
        return self.repo.find_all_with_count()

    def find_providers(self) -> list[LLMProviderModels]:
        return self.repo.find_provider_models()

    def find_all_providers(self, workspace_id) -> list[LLMProviderModels]:
        system_provider_models = self.repo.find_provider_models()
        workspace_models = self.wls.find_all({"workspace_id": workspace_id, "status": Status.ACTIVE})
        if len(workspace_models) > 0:
            for provider in system_provider_models:
                w_models = [x for x in workspace_models if x.provider == provider["name"]]
                if len(w_models) > 0:
                    models: list[LLMPublic] = [LLMPublic(**(item.model_dump())) for item in w_models]
                    provider["models"].extend(models)

        return system_provider_models

    def sync_provider(self, data: dict):
        obj = super().find_one({"name": data["name"]})
        if obj:
            super().update(obj.id, data)
        else:
            super().create(LLMProvider(**data), True)
