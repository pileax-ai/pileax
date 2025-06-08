from typing import Optional

from app.api.controllers.base_controller import BaseController
from app.api.models.user_book import UserBook, UserBookCreate, UserBookUpdate

class UserBookController(BaseController[UserBook, UserBookCreate, UserBookUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(UserBook, session, user_id)
