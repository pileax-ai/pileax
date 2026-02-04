from pydantic import TypeAdapter

from app.api.models.provider import ProviderInfo
from app.configs import app_config


class ProviderHelper:
    @staticmethod
    def get_providers() -> list[ProviderInfo]:
        raw_list = app_config.FACTORY_LLM_INFOS
        return TypeAdapter(list[ProviderInfo]).validate_python(raw_list)

    @staticmethod
    def get_provider(provider_id: str) -> ProviderInfo | None:
        provider = next((x for x in app_config.FACTORY_LLM_INFOS if x["name"].lower() == provider_id.lower()), None)
        if provider:
            return ProviderInfo.model_validate(provider)
        return None
