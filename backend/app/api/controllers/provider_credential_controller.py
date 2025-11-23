from typing import Any
from uuid import UUID

from fastapi import HTTPException

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.provider import Provider
from app.api.models.provider_credential import ProviderCredential, ProviderCredentialCreate, ProviderCredentialUpdate, \
    ProviderCredentialPublic
from app.api.services.provider_credential_service import ProviderCredentialService
from app.api.services.provider_service import ProviderService
from app.libs.provider_helper import ProviderHelper


class ProviderCredentialController(BaseController[ProviderCredential, ProviderCredentialCreate, ProviderCredentialUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(ProviderCredential, session, tenant_id, user_id)
        self.service = ProviderCredentialService(session)
        self.provider_service = ProviderService(session)

    def save(self, item_in: ProviderCredentialCreate) -> Any:
        # Check provider
        provider = item_in.provider
        provider_info = ProviderHelper.get_provider(provider)
        if provider_info is None:
            raise HTTPException(status_code=404, detail="Provider not supported")

        # Save provider credential
        item = item_in.model_dump(by_alias=True)
        item["credential"] = item_in.credential.model_dump_json(by_alias=True)
        item['tenantId'] = self.tenant_id
        item_out = self.service.save(ProviderCredential(**item))

        # Save provider
        self.provider_service.save(Provider(
            tenant_id=self.tenant_id,
            provider=provider,
            credential_id=item_out.id
        ))

        return ProviderCredentialPublic.model_validate(item_out)

    def delete(self, id: UUID) -> Any:
        provider_credential = super().get(id)
        if provider_credential is None:
            return None

        # delete
        super().delete(id)

        # update credential_id in provider
        provider = self.provider_service.find_one({
            "tenant_id": self.tenant_id,
            "credential_id": id
        })
        if provider is None:
            return None

        # get new credential id
        new_provider_credential = self.service.find_one({
            "tenant_id": self.tenant_id,
            "provider": provider_credential.provider
        })
        credential_id = new_provider_credential.id if new_provider_credential else None
        self.provider_service.update(provider.id, {
            "credential_id": credential_id
        })

        return None
