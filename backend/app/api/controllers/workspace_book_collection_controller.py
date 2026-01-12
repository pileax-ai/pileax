from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspaceId, SessionDep
from app.api.models.query import PaginationQuery
from app.api.models.workspace_book_collection import (
    WorkspaceBookCollection,
    WorkspaceBookCollectionCreate,
    WorkspaceBookCollectionUpdate,
)
from app.api.services.workspace_book_collection_service import WorkspaceBookCollectionService


class WorkspaceBookCollectionController(
    BaseController[WorkspaceBookCollection, WorkspaceBookCollectionCreate, WorkspaceBookCollectionUpdate]
):
    def __init__(self, session: SessionDep, user_id: CurrentUserId, workspace_id: CurrentWorkspaceId):
        super().__init__(WorkspaceBookCollection, session, user_id, workspace_id)
        self.service = WorkspaceBookCollectionService(session)

    def get_all(self):
        return self.service.get_all(self.user_id, self.workspace_id)

    def query_book_details(self, query: PaginationQuery):
        if query.condition.get("userId") is None:
            query.condition["userId"] = self.user_id
        if query.condition.get("workspaceId") is None:
            query.condition["workspaceId"] = self.workspace_id
        return self.service.query_book_details(query)
