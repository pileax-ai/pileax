from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.app import App, AppCreate, AppUpdate


class AppController(BaseController[App, AppCreate, AppUpdate]):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(App, session, user, workspace)
