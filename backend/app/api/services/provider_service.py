from typing import Any
from uuid import UUID

from fastapi import HTTPException, status

from app.api.models.owner import Owner
from app.api.models.provider import Provider
from app.api.repos.provider_repository import ProviderRepository
from app.api.services.base_service import BaseService
from app.api.services.provider_credential_service import ProviderCredentialService
from app.libs.provider_helper import ProviderHelper


class ProviderService(BaseService[Provider]):
    def __init__(self, session):
        super().__init__(Provider, session, ProviderRepository)
        self.credential_service = ProviderCredentialService(session)

    def save(self, provider_in: Provider) -> Provider:
        provider = self.find_one(
            {
                "workspace_id": provider_in.workspace_id,
                "provider": provider_in.provider,
            }
        )
        if provider:
            return self.update_credential_id(provider, provider_in.credential_id)

        return super().save(provider_in)

    def update_credential_id(self, provider: Provider, credential_id: UUID) -> Provider:
        if provider.credential_id is None and credential_id:
            return super().update(provider.id, {"credential_id": credential_id})
        return provider

    def delete_provider(self, id: UUID, user_id: UUID, workspace_id: UUID) -> Any:
        provider = super().get(id)
        if provider is None:
            return None

        exist_credential = self.credential_service.exists(workspace_id=workspace_id, provider=provider.provider)
        if exist_credential:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Provider credential exists")

        return super().delete_by_owner(Owner(
            user_id=user_id,
            workspace_id=workspace_id,
        ), id)

    def find_all_provider(self, workspace_id: UUID) -> list[Provider]:
        providers = super().find_all(
            {
                "workspace_id": workspace_id,
            }
        )
        credentials = self.credential_service.find_all(
            {
                "workspace_id": workspace_id,
            }
        )

        all_providers = []
        for p in providers:
            provider = p.model_dump(by_alias=True)
            provider["credentials"] = [c for c in credentials if c.provider == p.provider]
            all_providers.append(provider)

        return all_providers

    def find_all_model(self, workspace_id: UUID):
        providers = super().find_all(
            {
                "workspace_id": workspace_id,
            }
        )
        filtered_providers = [
            p for p in providers
            if p.credential_id is not None
        ]

        all_models = []
        for p in filtered_providers:
            provider = ProviderHelper.get_provider(p.provider)
            if provider:
                llm = provider["llm"]
                for item in llm:
                    item["provider"] = provider["name"]
                    item["logo"] = provider["logo"]
                    all_models.append(item)

        return all_models

    def find_model_by_type(self, workspace_id: UUID, model_type: str) -> Any:
        all_models = self.find_all_model(workspace_id)
        return [x for x in all_models if x["model_type"].lower() == model_type.lower()]
