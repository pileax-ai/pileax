import uuid
from itertools import starmap

from sqlmodel import select

from app.api.models.enums import Status
from app.api.models.workspace import Workspace
from app.api.models.workspace_member import WorkspaceMember
from app.api.repos.base_repository import BaseRepository


class UserWorkspaceRepository(BaseRepository[WorkspaceMember]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_user_workspaces(self, user_id: uuid.UUID) -> list[Workspace]:
        stmt = (
            select(Workspace)
            .join(WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id)
            .where(
                WorkspaceMember.user_id == user_id,
                WorkspaceMember.status == Status.ACTIVE,
                Workspace.status == Status.ACTIVE,
            )
        )
        workspaces: list[Workspace] = list(self.session.exec(stmt).all())
        return workspaces

    def get_user_workspaces_details(self, user_id: uuid.UUID) -> list[dict]:
        stmt = (
            select(Workspace, WorkspaceMember)
            .join(WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id)
            .where(WorkspaceMember.user_id == user_id, Workspace.status == Status.ACTIVE)
        )
        return list(starmap(self._build_details, self.session.exec(stmt).all()))

    def _build_details(self, workspace: Workspace, workspace_member: WorkspaceMember) -> dict:
        return {
            **workspace.model_dump(),
            "workspace_member_id": workspace_member.id,
            "member_role": workspace_member.role,
            "member_status": workspace_member.status,
        }
