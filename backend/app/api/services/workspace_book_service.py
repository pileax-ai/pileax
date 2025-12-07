from typing import Any

from fastapi import HTTPException
from uuid import UUID

from sqlalchemy import delete
from sqlmodel import select

from app.api.models.owner import Owner
from app.api.models.query import PaginationQuery
from app.api.models.workspace_book import WorkspaceBook
from app.api.models.workspace_book_collection import WorkspaceBookCollection
from app.api.repos.workspace_book_repository import WorkspaceBookRepository
from app.api.services.base_service import BaseService

class WorkspaceBookService(BaseService[WorkspaceBook]):
    def __init__(self, session):
        super().__init__(WorkspaceBook, session, WorkspaceBookRepository)
        self.session = session

    def delete_by_owner(self, user_id: UUID, workspace_id: UUID, id: UUID) -> Any:
        super().delete_by_owner(Owner(user_id=user_id, workspace_id=workspace_id), id)

        # Delete from workspace_book_collection
        stmt = delete(WorkspaceBookCollection).where(WorkspaceBookCollection.workspace_book_id == id)
        self.session.exec(stmt)
        self.session.commit()

    def get_workspace_book(self, workspace_id: UUID, book_id: UUID) -> WorkspaceBook:
        stmt = (
            select(WorkspaceBook)
            .where(WorkspaceBook.workspace_id == workspace_id)
            .where(WorkspaceBook.book_id == book_id)
        )
        book = self.session.exec(stmt).first()
        return book

    def get_stats(self, workspace_id: UUID) -> dict:
        extension_stat = self.repo.get_extension_stats(workspace_id)
        status_stat = self.repo.get_status_stats(workspace_id)

        return extension_stat + status_stat

    def get_details(self, id: UUID):
        obj = self.repo.get_details(id)
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return obj

    def query_details(self, query: PaginationQuery):
        return self.repo.query_details(query)
