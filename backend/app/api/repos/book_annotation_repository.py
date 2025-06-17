from app.api.models.book_annotation import BookAnnotation
from app.api.repos.base_repository import BaseRepository


class BookAnnotationRepository(BaseRepository[BookAnnotation]):
    def __init__(self, model, session):
        super().__init__(model, session)
