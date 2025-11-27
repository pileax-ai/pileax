from fastapi import HTTPException

from app.api.models.tenant_default_model import TenantDefaultModelCredential
from app.constants.enums import LLMType
from app.core.llm.models import ChatModel


class TenantLLMService:
    @classmethod
    def model_instance(cls, model_config: TenantDefaultModelCredential, **kwargs):
        provider = model_config.provider
        model_type = model_config.model_type
        model_name = model_config.model_name
        api_key = model_config.credential.api_key
        base_url = model_config.credential.base_url

        kwargs.update({"provider": provider})
        if model_type == LLMType.CHAT:
            assert provider in ChatModel, f"Chat model from {provider} is not supported yet."
            return ChatModel[provider](api_key, model_name, base_url, **kwargs)

        raise HTTPException(status_code=404, detail=f"Model for {provider} is not supported yet.")
