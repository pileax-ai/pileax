from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.tenant_default_model import TenantDefaultModel, TenantDefaultModelCreate, TenantDefaultModelUpdate
from app.api.services.tenent_default_model_service import TenantDefaultModelService


class TenantDefaultModelController(BaseController[TenantDefaultModel, TenantDefaultModelCreate, TenantDefaultModelUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(TenantDefaultModel, session, tenant_id, user_id)
        self.service = TenantDefaultModelService(session)

    def save(self, item_in: TenantDefaultModelCreate) -> TenantDefaultModel:
        return self.service.create_update(item_in, self.tenant_id)

    def get_by_type(self, model_type: str) -> TenantDefaultModel:
        return self.service.get_by_type(self.tenant_id, model_type)
