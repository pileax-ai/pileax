from uuid import UUID

from app.api.models.query import PaginationQuery
from app.api.models.tenant_book_collection import TenantBookCollection
from app.api.repos.tenant_book_collection_repository import TenantBookCollectionRepository
from app.api.services.base_service import BaseService

class TenantBookCollectionService(BaseService[TenantBookCollection]):
    def __init__(self, session):
        super().__init__(TenantBookCollection, session, TenantBookCollectionRepository)

    def get_all(self, tenant_id: UUID) -> list:
        return self.repo.get_all(tenant_id)

    def query_book_details(self, query: PaginationQuery):
        return self.repo.query_book_details(query)
