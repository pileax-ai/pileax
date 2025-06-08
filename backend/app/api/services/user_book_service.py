from fastapi import HTTPException
from uuid import UUID

from app.api.models.query import PaginationQuery
from app.api.models.user_book import UserBook
from app.api.repos.user_book_repository import UserBookRepository
from app.api.services.base_service import BaseService

class UserBookService(BaseService[UserBook]):
    def __init__(self, session):
        super().__init__(UserBook, session, UserBookRepository)

    def get_details(self, id: UUID):
        obj = self.repo.get_details(id)
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return obj

    def query_details(self, query: PaginationQuery):
        return self.repo.query_details(query)
