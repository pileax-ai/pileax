from typing import List

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspaceId
from app.api.models.book_collection import BookCollection, BookCollectionCreate, BookCollectionUpdate
from app.api.services.book_collection_service import BookCollectionService


class BookCollectionController(BaseController[BookCollection, BookCollectionCreate, BookCollectionUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId
    ):
        super().__init__(BookCollection, session, workspace_id, user_id)
        self.service = BookCollectionService(session)

    def find_all(self) -> List[BookCollection]:
        return self.service.find_all({"workspace_id": self.workspace_id})
