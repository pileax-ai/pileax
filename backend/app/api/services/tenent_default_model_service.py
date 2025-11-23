from uuid import UUID

from app.api.models.tenant_default_model import TenantDefaultModel, TenantDefaultModelCreate
from app.api.repos.tenent_default_model_repository import TenantDefaultModelRepository
from app.api.services.base_service import BaseService

class TenantDefaultModelService(BaseService[TenantDefaultModel]):
    def __init__(self, session):
        super().__init__(TenantDefaultModel, session, TenantDefaultModelRepository)

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
