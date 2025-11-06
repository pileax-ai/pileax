from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.query import PaginationQuery
from app.api.models.tenant_book import TenantBook, TenantBookCreate, TenantBookUpdate
from app.api.services.tenant_book_service import TenantBookService


class TenantBookController(BaseController[TenantBook, TenantBookCreate, TenantBookUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(TenantBook, session, tenant_id, user_id)
        self.service = TenantBookService(session)

    def get_details(self, id: UUID):
        return self.service.get_details(id)

    def query_details(self, query: PaginationQuery):
        return self.service.query_details(query)
