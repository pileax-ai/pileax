from app.api.models.user_book import UserBook
from app.api.repos.user_book_repository import UserBookRepository
from app.api.services.base_service import BaseService

class UserBookService(BaseService[UserBook]):
    def __init__(self, session):
        super().__init__(UserBook, session, UserBookRepository)
