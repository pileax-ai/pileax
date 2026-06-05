from typing import Any
from uuid import UUID

from app.api.models.book_annotation import BookAnnotation
from app.api.models.query import PaginationQuery
from app.api.repos.book_annotation_repository import BookAnnotationRepository
from app.api.services.base_service import BaseService


class BookAnnotationService(BaseService[BookAnnotation]):
    def __init__(self, session):
        super().__init__(BookAnnotation, session, BookAnnotationRepository)

    def query_details(self, query: PaginationQuery):
        return self.repo.query_details(query)

    def group_by_book(self, user_id: UUID, workspace_id: UUID, keyword: str | None = None) -> Any:
        return self.repo.group_by_book(user_id, workspace_id, keyword)
