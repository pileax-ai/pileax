from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.tenant import Tenant, TenantCreate, TenantUpdate
from app.api.services.tenant_service import TenantService


class TenantController(BaseController[Tenant, TenantCreate, TenantUpdate]):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(Tenant, session, user, workspace)
        self.service = TenantService(session, user.id)

    def save(self, item_in: TenantCreate) -> Tenant:
        return self.service.save(item_in)
