from uuid import UUID

from fastapi import HTTPException

from app.api.models.provider_default_model import ProviderDefaultModel, ProviderDefaultModelCreate, \
    ProviderDefaultModelCredential
from app.api.repos.provider_default_model_repository import ProviderDefaultModelRepository
from app.api.services.base_service import BaseService
from app.core.llm.services.tenant_llm_service import TenantLLMService


class ProviderDefaultModelService(BaseService[ProviderDefaultModel]):
    def __init__(self, session, workspace_id: UUID, user_id: UUID):
        super().__init__(ProviderDefaultModel, session, ProviderDefaultModelRepository)
        self.workspace_id = workspace_id
        self.user_id = user_id

    def create_update(self, item_in: ProviderDefaultModelCreate, workspace_id: UUID) -> ProviderDefaultModel:
        model = self.find_one({
            "workspace_id": workspace_id,
            "model_type": item_in.model_type,
        })

        # update
        if model:
            return self.update(model.id, {
                "provider": item_in.provider,
                "model_name": item_in.model_name,
            })

        # create
        item = item_in.model_dump(by_alias=True)
        item['workspace_id'] = workspace_id
        return super().save(ProviderDefaultModel(**item))

    def get_by_type(self, workspace_id: UUID, model_type: str) -> ProviderDefaultModel:
        return self.find_one({
            "workspace_id": workspace_id,
            "model_type": model_type,
        }, True)

    def get_default_model_credential(self, workspace_id: UUID, model_type: str) -> ProviderDefaultModelCredential | None:
        return self.repo.get_default_model_credential(workspace_id, model_type)

    def model_instance(self, workspace_id: UUID, model_type: str):
        pdm_credential = self.get_default_model_credential(workspace_id, model_type)
        credential = pdm_credential.credential

        if credential is None:
            raise HTTPException(status_code=403, detail=f"Default model for {model_type} has not been configured yet.")

        return TenantLLMService.model_instance(pdm_credential)
