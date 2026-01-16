from uuid import UUID

from fastapi import HTTPException

from app.api.models.provider_default_model import (
    ProviderDefaultModel,
    ProviderDefaultModelCreate,
    ProviderDefaultModelCredential,
)
from app.api.repos.provider_default_model_repository import ProviderDefaultModelRepository
from app.api.services.base_service import BaseService
from app.core.llm.services.tenant_llm_service import TenantLLMService


class ProviderDefaultModelService(BaseService[ProviderDefaultModel]):
    def __init__(self, session, user_id: UUID, workspace_id: UUID):
        super().__init__(ProviderDefaultModel, session, ProviderDefaultModelRepository)
        self.user_id = user_id
        self.workspace_id = workspace_id

    def create_update(self, item_in: ProviderDefaultModelCreate, updatable=True) -> ProviderDefaultModel:
        model = self.find_one(
            {
                "workspace_id": self.workspace_id,
                "model_type": item_in.model_type,
            }
        )

        # update
        if model:
            if updatable:
                return self.update(
                    model.id,
                    {
                        "provider": item_in.provider,
                        "model_name": item_in.model_name,
                    },
                )
            else:
                return model

        # create
        item = item_in.model_dump(by_alias=True)
        item["workspace_id"] = self.workspace_id
        return super().save(ProviderDefaultModel(**item))

    def init(self, provider_info: dict):
        """
        Init all types default models when creating provider credential
        :param provider_info: Provider info
        """
        provider = provider_info["name"]
        llm_list = provider_info["llm"]
        model_type_list = []
        for llm in llm_list:
            model_type = llm["model_type"]
            if model_type not in model_type_list:
                self.create_update(
                    ProviderDefaultModelCreate(
                        provider=provider,
                        model_name=llm["llm_name"],
                        model_type=llm["model_type"],
                    ),
                    False,
                )
                model_type_list.append(model_type)

    def get_by_type(self, model_type: str) -> ProviderDefaultModel:
        return self.find_one(
            {
                "workspace_id": self.workspace_id,
                "model_type": model_type,
            },
            True,
        )

    def get_default_model_credential(
        self, workspace_id: UUID, model_type: str
    ) -> ProviderDefaultModelCredential | None:
        return self.repo.get_default_model_credential(workspace_id, model_type)

    def remove_by_provider(self, provider: str):
        return super().delete_all(
            {
                "workspace_id": self.workspace_id,
                "provider": provider,
            }
        )

    def model_instance(self, workspace_id: UUID, model_type: str):
        pdm_credential = self.get_default_model_credential(workspace_id, model_type)
        credential = pdm_credential.credential

        if credential is None:
            raise HTTPException(status_code=403, detail=f"Default model for {model_type} has not been configured yet.")

        return TenantLLMService.model_instance(pdm_credential)
