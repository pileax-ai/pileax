from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.app import App, AppCreate, AppUpdate

class AppController(BaseController[App, AppCreate, AppUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(App, session, tenant_id, user_id)
