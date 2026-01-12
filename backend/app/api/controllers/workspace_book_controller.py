from typing import Any
from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspaceId, SessionDep
from app.api.models.query import PaginationQuery
from app.api.models.workspace_book import (
    WorkspaceBook,
    WorkspaceBookCreate,
    WorkspaceBookUpdate,
)
from app.api.services.user_book_service import UserBookService
from app.api.services.workspace_book_service import WorkspaceBookService


class WorkspaceBookController(BaseController[WorkspaceBook, WorkspaceBookCreate, WorkspaceBookUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId,
    ):
        super().__init__(WorkspaceBook, session, user_id, workspace_id)
        self.service = WorkspaceBookService(session)

    def save(self, item: WorkspaceBookCreate) -> WorkspaceBook:
        book = self.service.get_workspace_book(self.user_id, self.workspace_id, item.book_id)
        if book:
            return book
        book = super().save(item)

        # create user_book
        UserBookService(self.session).create_user_book(self.user_id, item.book_id)

        self.session.refresh(book)

        return book

    def delete(self, id: UUID) -> Any:
        return self.service.delete_by_owner(self.user_id, self.workspace_id, id)

    def get_details(self, id: UUID):
        return self.service.get_details(id)

    def query_details(self, query: PaginationQuery):
        if query.condition.get("userId") is None:
            query.condition["userId"] = self.user_id
        if query.condition.get("workspaceId") is None:
            query.condition["workspaceId"] = self.workspace_id
        return self.service.query_details(query)

    def get_stats(self):
        return self.service.get_stats(self.user_id, self.workspace_id)
