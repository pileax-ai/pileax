from app.api.models.book_annotation import BookAnnotation
from app.api.repos.book_annotation_repository import BookAnnotationRepository
from app.api.services.base_service import BaseService

class BookAnnotationService(BaseService[BookAnnotation]):
    def __init__(self, session):
        super().__init__(BookAnnotation, session, BookAnnotationRepository)
