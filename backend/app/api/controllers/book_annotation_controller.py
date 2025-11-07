from typing import List

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.book_annotation import BookAnnotation, BookAnnotationCreate, BookAnnotationUpdate
from app.api.models.query import PaginationQuery
from app.api.services.book_annotation_service import BookAnnotationService


class BookAnnotationController(BaseController[BookAnnotation, BookAnnotationCreate, BookAnnotationUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(BookAnnotation, session, tenant_id, user_id)
        self.service = BookAnnotationService(session)

    def find_all_by_book(self, id: str) -> List[BookAnnotation]:
        """
        Find all by tenant_book id
        :param id: tenant book id
        """
        return self.service.find_all({"tenant_book_id": id})

    def query_details(self, query: PaginationQuery):
        return self.service.query_details(query)
