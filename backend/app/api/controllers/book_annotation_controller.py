from typing import Any
from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspaceId, SessionDep
from app.api.models.book_annotation import BookAnnotation, BookAnnotationCreate, BookAnnotationUpdate
from app.api.models.owner import Owner
from app.api.models.query import PaginationQuery
from app.api.services.book_annotation_service import BookAnnotationService


class BookAnnotationController(BaseController[BookAnnotation, BookAnnotationCreate, BookAnnotationUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId
    ):
        super().__init__(BookAnnotation, session, user_id, workspace_id)
        self.service = BookAnnotationService(session)

    def find_all_by_book(self, book_id: UUID) -> list[BookAnnotation]:
        """
        Find all by book id
        """
        return self.service.find_all({
            "book_id": book_id,
            "user_id": self.user_id,
        })

    def query_details(self, query: PaginationQuery):
        if query.condition.get('userId') is None:
            query.condition['userId'] = self.user_id
        return self.service.query_details(query)

    def delete(self, id: UUID) -> Any:
        return self.service.delete_by_owner(Owner(user_id=self.user_id), id)
