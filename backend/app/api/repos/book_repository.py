from app.api.models.book import Book
from app.api.repos.base_repository import BaseRepository


class BookRepository(BaseRepository[Book]):
    def __init__(self, session):
        super().__init__(Book, session)
