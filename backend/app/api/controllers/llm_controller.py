from fastapi import HTTPException

from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.libs.provider_helper import ProviderHelper


class LLMController():
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        pass

    def get_providers(self):
        return ProviderHelper.get_providers()

    def get_provider(self, provider_id: str) -> dict:
        provider = ProviderHelper.get_provider(provider_id)
        if not provider:
            raise HTTPException(status_code=404, detail=f"Provider {provider_id} not found")
        return provider

