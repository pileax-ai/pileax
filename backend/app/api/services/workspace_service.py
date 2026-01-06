import uuid

from app.api.models.tenant import Tenant
from app.api.models.user import User
from app.api.models.workspace import Workspace, WorkspaceCreate, WorkspaceType
from app.api.models.workspace_member import WorkspaceMember, WorkspaceMemberRole
from app.api.repos.base_repository import BaseRepository
from app.api.repos.user_workspace_repository import UserWorkspaceRepository
from app.api.services.base_service import BaseService
from app.api.services.workspace_member_service import WorkspaceMemberService


class WorkspaceService(BaseService[Workspace]):
    def __init__(self, session, workspace_id: uuid.UUID | None = None):
        super().__init__(Workspace, session, BaseRepository)
        self.workspace_id = workspace_id

    def create_default(self, user: User, tenant: Tenant) -> WorkspaceMember:
        # Workspace
        workspace = Workspace(
            user_id=user.id,
            tenant_id=tenant.id,
            name=user.name,
            type=WorkspaceType.PERSONAL,
        )
        workspace = self.create(workspace)

        # Workspace member
        workspace_member = WorkspaceMember(
            user_id=user.id,
            workspace_id=workspace.id,
            role=WorkspaceMemberRole.OWNER,
            invited_by=user.id,
        )

        return WorkspaceMemberService(self.session).create(workspace_member)

    def save(self, item_in: WorkspaceCreate, commit: bool = True) -> Workspace:
        # Current workspace
        current_workspace = self.get(self.workspace_id)

        # Workspace
        item = item_in.model_dump(by_alias=True)
        item['tenant_id'] = current_workspace.tenant_id
        item['user_id'] = current_workspace.user_id
        workspace = self.create(Workspace(**item), commit=False)

        # Workspace member
        workspace_member = WorkspaceMember(
            user_id=workspace.user_id,
            workspace_id=workspace.id,
            role=WorkspaceMemberRole.OWNER,
            invited_by=workspace.user_id,
        )
        WorkspaceMemberService(self.session).create(workspace_member)

        self.session.refresh(workspace)

        return workspace

    def get_user_workspaces(self, user_id: uuid.UUID) -> list[Workspace]:
        return UserWorkspaceRepository(Workspace, self.session).get_user_workspaces(user_id)
