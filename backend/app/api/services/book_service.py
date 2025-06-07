from app.api.models.book import Book
from app.api.repos.book_repository import BookRepository
from app.api.services.base_service import BaseService

class BookService(BaseService[Book]):
    def __init__(self, session):
        super().__init__(Book, session, BookRepository)
