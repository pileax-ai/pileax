from uuid import UUID

from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspaceId
from app.api.models.query import PaginationQuery
from app.api.services.workspace_member_service import WorkspaceMemberService


class WorkspaceMemberController:
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId
    ):
        self.service = WorkspaceMemberService(session)
        self.workspace_id = workspace_id

    def get_details(self, id: UUID):
        return self.service.get_details(id)

    def query_details(self, query: PaginationQuery):
        query.condition.setdefault("workspace_id", self.workspace_id)
        return self.service.query_details(query)
