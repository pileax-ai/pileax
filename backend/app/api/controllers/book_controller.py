from typing import Optional

from app.api.controllers.base_controller import BaseController
from app.api.models.book import Book, BookCreate, BookUpdate

class BookController(BaseController[Book, BookCreate, BookUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(Book, session, user_id)
