from uuid import UUID

from fastapi import HTTPException

from app.api.models.tenant_default_model import TenantDefaultModel, TenantDefaultModelCreate, \
    TenantDefaultModelCredential
from app.api.repos.tenent_default_model_repository import TenantDefaultModelRepository
from app.api.services.base_service import BaseService
from app.core.llm.services.tenant_llm_service import TenantLLMService


class TenantDefaultModelService(BaseService[TenantDefaultModel]):
    def __init__(self, session, tenant_id: UUID, user_id: UUID):
        super().__init__(TenantDefaultModel, session, TenantDefaultModelRepository)
        self.tenant_id = tenant_id
        self.user_id = user_id

    def create_update(self, item_in: TenantDefaultModelCreate, tenant_id: UUID) -> TenantDefaultModel:
        model = self.find_one({
            "tenant_id": tenant_id,
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
        item['tenant_id'] = tenant_id
        return super().save(TenantDefaultModel(**item))

    def get_by_type(self, tenant_id: UUID, model_type: str) -> TenantDefaultModel:
        return self.find_one({
            "tenant_id": tenant_id,
            "model_type": model_type,
        }, True)

    def get_default_model_credential(self, tenant_id: UUID, model_type: str) -> TenantDefaultModelCredential | None:
        return self.repo.get_default_model_credential(tenant_id, model_type)

    def model_instance(self, tenant_id: UUID, model_type: str):
        tdm_credential = self.get_default_model_credential(tenant_id, model_type)
        credential = tdm_credential.credential

        if credential is None:
            raise HTTPException(status_code=403, detail=f"Default model for {model_type} has not been configured yet.")

        return TenantLLMService.model_instance(tdm_credential)
