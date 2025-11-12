from typing import Any

from fastapi import HTTPException
from uuid import UUID

from sqlalchemy import delete
from sqlmodel import select

from app.api.models.query import PaginationQuery
from app.api.models.tenant_book import TenantBook
from app.api.models.tenant_book_collection import TenantBookCollection
from app.api.repos.tenant_book_repository import TenantBookRepository
from app.api.services.base_service import BaseService

class TenantBookService(BaseService[TenantBook]):
    def __init__(self, session):
        super().__init__(TenantBook, session, TenantBookRepository)
        self.session = session

    def delete_by_owner(self, user_id: UUID, tenant_id: UUID, id: UUID) -> Any:
        super().delete_by_owner(user_id, tenant_id, id)

        # Delete tenant_book_collection
        stmt = delete(TenantBookCollection).where(TenantBookCollection.tenant_book_id == id)
        self.session.exec(stmt)
        self.session.commit()

    def get_tenant_book(self, tenant_id: UUID, book_id: UUID) -> TenantBook:
        stmt = (
            select(TenantBook)
            .where(TenantBook.tenant_id == tenant_id)
            .where(TenantBook.book_id == book_id)
        )
        book = self.session.exec(stmt).first()
        return book

    def get_stats(self, tenant_id: UUID) -> dict:
        extension_stat = self.repo.get_extension_stats(tenant_id)
        status_stat = self.repo.get_status_stats(tenant_id)

        return extension_stat + status_stat

    def get_details(self, id: UUID):
        obj = self.repo.get_details(id)
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return obj

    def query_details(self, query: PaginationQuery):
        return self.repo.query_details(query)
