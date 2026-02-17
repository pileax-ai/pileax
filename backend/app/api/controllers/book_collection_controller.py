from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.book_collection import BookCollection, BookCollectionCreate, BookCollectionUpdate
from app.api.services.book_collection_service import BookCollectionService


class BookCollectionController(BaseController[BookCollection, BookCollectionCreate, BookCollectionUpdate]):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(BookCollection, session, user, workspace)
        self.service = BookCollectionService(session)

    def find_all(self) -> list[BookCollection]:
        return self.service.find_all(
            {
                "user_id": self.user.id,
                "workspace_id": self.workspace_id,
            }
        )
