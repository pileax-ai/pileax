from typing import Optional
from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.models.query import PaginationQuery
from app.api.models.user_book import UserBook, UserBookCreate, UserBookUpdate
from app.api.services.user_book_service import UserBookService


class UserBookController(BaseController[UserBook, UserBookCreate, UserBookUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(UserBook, session, user_id)
        self.service = UserBookService(session)

    def get_details(self, id: UUID):
        return self.service.get_details(id)

    def query_details(self, query: PaginationQuery):
        return self.service.query_details(query)
