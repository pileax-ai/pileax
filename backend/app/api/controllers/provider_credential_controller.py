from typing import Any
from uuid import UUID

from fastapi import HTTPException

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.llm import LLM
from app.api.models.owner import Owner
from app.api.models.provider import Provider
from app.api.models.provider_credential import (
    ProviderCredential,
    ProviderCredentialCreate,
    ProviderCredentialPublic,
    ProviderCredentialUpdate,
)
from app.api.models.workspace_llm import WorkspaceLLMCreate
from app.api.services.provider_credential_service import ProviderCredentialService
from app.api.services.provider_default_model_service import ProviderDefaultModelService
from app.api.services.provider_service import ProviderService
from app.api.services.workspace_llm_service import WorkspaceLLMService
from app.constants import HIDDEN_VALUE
from app.core.llm.utils.llm_helper import LLMHelper
from app.libs.provider_helper import ProviderHelper


class ProviderCredentialController(
    BaseController[ProviderCredential, ProviderCredentialCreate, ProviderCredentialUpdate]
):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(ProviderCredential, session, user, workspace)
        self.workspace = workspace
        self.service = ProviderCredentialService(session)
        self.provider_service = ProviderService(session, workspace)
        self.pdm_service = ProviderDefaultModelService(session, user.id, workspace.id)
        self.workspace_llm_service = WorkspaceLLMService(session)

    def get(self, id: UUID, decrypt=True) -> ProviderCredential:
        pc = super().get(id)
        if pc.credential["apiKey"]:
            if decrypt:
                pc.credential["apiKey"] = self.service.decrypt_api_key(pc.credential["apiKey"], self.workspace)
            else:
                pc.credential["apiKey"] = HIDDEN_VALUE

        return pc

    def save(self, item_in: ProviderCredentialCreate) -> Any:
        # Check provider
        provider = item_in.provider
        provider_info = ProviderHelper.get_provider(provider)
        if provider_info is None:
            raise HTTPException(status_code=404, detail="Provider not supported")

        # Check api_key
        if item_in.llm:
            LLMHelper.validate_llm_api_key(
                provider, item_in.llm, item_in.credential.api_key, item_in.credential.base_url
            )
        else:
            # use user saved llm
            workspace_llm = self.workspace_llm_service.find_one(
                {
                    "workspace_id": self.workspace.id,
                    "provider": provider,
                }
            )
            if workspace_llm:
                llm = LLM(**(workspace_llm.model_dump()))
                LLMHelper.validate_llm_api_key(provider, llm, item_in.credential.api_key, item_in.credential.base_url)
            else:
                raise HTTPException(status_code=404, detail=f"LLM of {provider} not found")

        # Encrypt api-key
        credential = self.service.encrypt(item_in.credential, self.workspace)

        # Save provider credential
        item = item_in.model_dump(by_alias=True)
        item["credential"] = credential.model_dump(by_alias=True)
        item["workspaceId"] = self.workspace.id
        item_out = self.service.save(ProviderCredential(**item))

        # Save provider
        self.provider_service.save(
            Provider(workspace_id=self.workspace.id, provider=provider, credential_id=item_out.id)
        )

        # Save workspace LLM
        if item_in.llm:
            llm_item_in = item_in.llm.model_dump(by_alias=True)
            llm_item_in["provider"] = provider
            self.workspace_llm_service.save(WorkspaceLLMCreate(**llm_item_in), self.workspace.id)

        # Init default models
        self.pdm_service.init(provider_info)

        return ProviderCredentialPublic.model_validate(item_out)

    def update(self, item_in: ProviderCredentialUpdate) -> Any:
        # Check provider
        provider = item_in.provider
        provider_info = ProviderHelper.get_provider(provider)
        if provider_info is None:
            raise HTTPException(status_code=404, detail="Provider not supported")

        # Check credential
        pc = super().get(item_in.id)

        # Check api_key
        api_key = item_in.credential.api_key
        if api_key:
            if api_key == HIDDEN_VALUE:
                item_in.credential.api_key = pc.credential["apiKey"]
            else:
                LLMHelper.validate_api_key(provider, api_key, item_in.credential.base_url)
                item_in.credential.api_key = self.service.encrypt_api_key(item_in.credential.api_key, self.workspace)

        # Update
        item = item_in.model_dump(by_alias=True)

        return self.service.update_by_owner(Owner(workspace=self.workspace, user_id=self.user.id), item_in.id, item)

    def delete(self, id: UUID) -> Any:
        provider_credential = super().get(id)
        if provider_credential is None:
            return None

        # delete
        super().delete(id)

        # update credential_id in provider
        provider = self.provider_service.find_one({"workspace_id": self.workspace.id, "credential_id": id})
        if provider is None:
            return None

        # get new credential id
        new_provider_credential = self.service.find_one(
            {"workspace_id": self.workspace.id, "provider": provider_credential.provider}
        )
        credential_id = new_provider_credential.id if new_provider_credential else None
        self.provider_service.update(provider.id, {"credential_id": credential_id})

        # remove default model if no credentials
        if new_provider_credential is None:
            self.pdm_service.remove_by_provider(provider_credential.provider)

        return None
