from uuid import UUID

from app.api.models.enums import BookCollectionType
from app.api.models.query import PaginationQuery
from app.api.models.workspace_book_collection import WorkspaceBookCollection
from app.api.repos.workspace_book_collection_repository import WorkspaceBookCollectionRepository
from app.api.services.base_service import BaseService


class WorkspaceBookCollectionService(BaseService[WorkspaceBookCollection]):
    def __init__(self, session):
        super().__init__(WorkspaceBookCollection, session, WorkspaceBookCollectionRepository)

    def get_all(self, user_id: UUID, workspace_id: UUID, type: int = BookCollectionType.BOOKLIST) -> list:
        return self.repo.get_all(user_id, workspace_id, type)

    def query_book_details(self, query: PaginationQuery):
        return self.repo.query_book_details(query)
