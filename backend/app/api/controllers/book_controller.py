from typing import Optional

from app.api.controllers.base_controller import BaseController
from app.api.models.book import Book, BookCreate, BookUpdate
from app.api.services.book_service import BookService


class BookController(BaseController[Book, BookCreate, BookUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(Book, session, user_id)
        self.service = BookService(session)

    def get_by_uuid(self, uuid: str) -> Book:
            return self.service.get_by_uuid(uuid)
