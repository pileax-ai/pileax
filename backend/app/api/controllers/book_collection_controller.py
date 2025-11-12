from typing import List

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.book_collection import BookCollection, BookCollectionCreate, BookCollectionUpdate
from app.api.services.book_collection_service import BookCollectionService


class BookCollectionController(BaseController[BookCollection, BookCollectionCreate, BookCollectionUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(BookCollection, session, tenant_id, user_id)
        self.service = BookCollectionService(session)

    def find_all(self) -> List[BookCollection]:
        return self.service.find_all({"tenant_id": self.tenant_id})
