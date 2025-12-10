from uuid import UUID

from sqlmodel import select

from app.api.models.user_book import UserBook
from app.api.repos.user_book_repository import UserBookRepository
from app.api.services.base_service import BaseService

class UserBookService(BaseService[UserBook]):
    def __init__(self, session):
        super().__init__(UserBook, session, UserBookRepository)
        self.session = session

    def get_user_book(self, user_id: UUID, book_id: UUID) -> UserBook:
        stmt = (
            select(UserBook)
            .where(UserBook.user_id == user_id)
            .where(UserBook.book_id == book_id)
        )
        return self.session.exec(stmt).first()


    def create_user_book(self, user_id: UUID, book_id: UUID) -> UserBook:
        user_book = self.get_user_book(user_id, book_id)
        if user_book:
            return user_book

        return self.save(UserBook(user_id=user_id, book_id=book_id))
