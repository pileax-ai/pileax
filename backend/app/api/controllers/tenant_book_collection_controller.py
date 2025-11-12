from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.query import PaginationQuery
from app.api.models.tenant_book_collection import TenantBookCollection, TenantBookCollectionCreate, TenantBookCollectionUpdate
from app.api.services.tenant_book_collection_service import TenantBookCollectionService


class TenantBookCollectionController(BaseController[TenantBookCollection, TenantBookCollectionCreate, TenantBookCollectionUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(TenantBookCollection, session, tenant_id, user_id)
        self.service = TenantBookCollectionService(session)

    def get_all(self):
        return self.service.get_all(self.tenant_id)

    def query_book_details(self, query: PaginationQuery):
        if query.condition.get('tenantId') is None:
            query.condition['tenantId'] = self.tenant_id
        return self.service.query_book_details(query)
