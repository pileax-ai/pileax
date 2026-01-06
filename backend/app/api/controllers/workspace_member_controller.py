from uuid import UUID

from fastapi import HTTPException

from app.api.deps import CurrentUserId, CurrentWorkspaceId, SessionDep
from app.api.models.enums import Status
from app.api.models.query import PaginationQuery
from app.api.models.workspace_member import WorkspaceMember, WorkspaceMemberInvite
from app.api.services.user_service import UserService
from app.api.services.workspace_member_service import WorkspaceMemberService


class WorkspaceMemberController:
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId
    ):
        self.service = WorkspaceMemberService(session)
        self.user_service = UserService(session)
        self.user_id = user_id
        self.workspace_id = workspace_id

    def invite(self, item_in: WorkspaceMemberInvite) -> WorkspaceMember:
        user = self.user_service.find_one({'email': item_in.email})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return self.service.invite(WorkspaceMember(
            workspace_id=self.workspace_id,
            user_id=user.id,
            role=item_in.role,
            invited_by=self.user_id,
            status=Status.PENDING
        ))

    def accept(self, id: UUID) -> WorkspaceMember:
        wm = self.service.get(id)
        if wm.user_id != self.user_id:
            raise HTTPException(status_code=403, detail="User does not match")

        return self.service.accept(id)

    def get_details(self, id: UUID):
        return self.service.get_details(id)

    def query_details(self, query: PaginationQuery):
        query.condition.setdefault("workspace_id", self.workspace_id)
        return self.service.query_details(query)
