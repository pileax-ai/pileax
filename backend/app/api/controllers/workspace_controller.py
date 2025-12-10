from typing import Any

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspaceId, CurrentWorkspace
from app.api.models.workspace import Workspace, WorkspaceCreate, WorkspaceUpdate
from app.api.services.workspace_service import WorkspaceService


class WorkspaceController(BaseController[Workspace, WorkspaceCreate, WorkspaceUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId,
    ):
        super().__init__(Workspace, session, user_id, workspace_id)
        self.service = WorkspaceService(session, workspace_id)


    def get_user_workspaces(self) -> Any:
        return self.service.get_user_workspaces(self.user_id)

    def save(self, item_in: WorkspaceCreate) -> Workspace:
        return self.service.save(item_in)
