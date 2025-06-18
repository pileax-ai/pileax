from app.api.models.book_annotation import BookAnnotation
from app.api.models.query import PaginationQuery
from app.api.repos.book_annotation_repository import BookAnnotationRepository
from app.api.services.base_service import BaseService

class BookAnnotationService(BaseService[BookAnnotation]):
    def __init__(self, session):
        super().__init__(BookAnnotation, session, BookAnnotationRepository)

    def query_details(self, query: PaginationQuery):
        return self.repo.query_details(query)
