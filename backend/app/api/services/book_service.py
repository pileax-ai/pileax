from uuid import UUID

from app.api.models.book import Book, BookDetails, BookPublic
from app.api.models.query import PaginationQuery, QueryResult
from app.api.repos.book_repository import BookRepository
from app.api.services.base_service import BaseService


class BookService(BaseService[Book]):
    def __init__(self, session):
        super().__init__(Book, session, BookRepository)

    def get_by_uuid(self, uuid: str, tenant_id: UUID) -> Book:
        return self.find_one({"tenant_id": tenant_id, "uuid": uuid}, True)

    def get_details(self, id: UUID, user_id: UUID) -> BookDetails:
        return self.repo.get_details(id, user_id)

    def query_library(self, user_id: UUID, workspace_id: UUID, query: PaginationQuery) -> QueryResult[BookPublic]:
        return self.repo.query_library(user_id, workspace_id, query)
