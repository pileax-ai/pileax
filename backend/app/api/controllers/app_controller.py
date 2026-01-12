from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspaceId, SessionDep
from app.api.models.app import App, AppCreate, AppUpdate


class AppController(BaseController[App, AppCreate, AppUpdate]):
    def __init__(self, session: SessionDep, user_id: CurrentUserId, workspace_id: CurrentWorkspaceId):
        super().__init__(App, session, user_id, workspace_id)
