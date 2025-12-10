from uuid import UUID

from sqlalchemy import select

from app.api.models.book import Book
from app.api.models.user_book import UserBook
from app.api.repos.base_repository import BaseRepository


class BookRepository(BaseRepository[Book]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_details(self, id: UUID, user_id: UUID) -> dict | None:
        stmt = (
            select(Book, UserBook)
            .join(UserBook, UserBook.book_id == Book.id, isouter=True)
            .filter(
                Book.id == id,
                UserBook.user_id == user_id,
            )
        )
        result = self.session.exec(stmt).first()
        if result:
            book, user_book = result
            return self.build_details(book, user_book)
        return None


    @staticmethod
    def build_details(book: Book, user_book: UserBook | None = None) -> dict:

        return {
            **book.model_dump(),

            "user_book_id": user_book.id if user_book else None,
            "rating": user_book.rating if user_book else None,
            "reading_position": user_book.reading_position if user_book else None,
            "reading_percentage": user_book.reading_percentage if user_book else None,
            "reading_status": user_book.reading_status if user_book else None,
        }
