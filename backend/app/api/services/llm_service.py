from collections import defaultdict

from fastapi import HTTPException
from pydantic import TypeAdapter

from app.api.models.provider import LLMInfo, ProviderInfo
from app.api.models.workspace_llm import WorkspaceLLM
from app.api.services.workspace_llm_service import WorkspaceLLMService
from app.libs.provider_helper import ProviderHelper

LLM_INFO_ADAPTER = TypeAdapter(list[LLMInfo])


class LLMService:
    def __init__(self, session, workspace):
        self.workspace = workspace
        self.workspace_llm_service = WorkspaceLLMService(session, workspace)

    def get_providers(self) -> list[ProviderInfo]:
        # Get from database and group
        llm_list = self.workspace_llm_service.find_all({"workspace_id": self.workspace.id})
        llm_group_by_provider: dict[str, list[WorkspaceLLM]] = defaultdict(list)
        for llm in llm_list:
            llm_group_by_provider[llm.provider].append(llm)

        # Default providers
        providers = ProviderHelper.get_providers()

        # Fill llm
        result: list[ProviderInfo] = []
        for provider in providers:
            if not provider.llm or len(provider.llm) == 0:
                # fill when llm is empty
                raw_llm = llm_group_by_provider.get(provider.name, [])
                llm = LLM_INFO_ADAPTER.validate_python(raw_llm)
                result.append(provider.model_copy(update={"llm": llm}))
            else:
                result.append(provider)

        return result

    def get_provider(self, provider_id: str) -> ProviderInfo:
        provider = ProviderHelper.get_provider(provider_id)
        if not provider:
            raise HTTPException(status_code=404, detail=f"Provider {provider_id} not found")

        if not provider.llm:
            raw_llm = self.workspace_llm_service.find_all(
                {
                    "workspace_id": self.workspace.id,
                    "provider": provider.name,
                }
            )
            provider.llm = LLM_INFO_ADAPTER.validate_python(raw_llm)

        return provider
