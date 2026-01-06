from typing import Any
from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspaceId, SessionDep
from app.api.models.owner import Owner
from app.api.models.user_book import ReadStatus, UserBook, UserBookCreate, UserBookUpdate, UserBookUpdateReadingProgress
from app.api.services.user_book_service import UserBookService


class UserBookController(BaseController[UserBook, UserBookCreate, UserBookUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId,
    ):
        super().__init__(UserBook, session, user_id, workspace_id)
        self.service = UserBookService(session)

    def save(self, item: UserBookCreate) -> UserBook:
        book = self.service.get_user_book(self.user_id, item.book_id)
        if book:
            return book
        return super().save(item)

    def delete(self, id: UUID) -> Any:
        return self.service.delete_by_owner(Owner(user_id=self.user_id, workspace_id=self.workspace_id), id)

    def update_reading_progress(self, item_in: UserBookUpdateReadingProgress) -> UserBook:
        user_book = self.service.find_one(
            {
                "user_id": self.user_id,
                "book_id": item_in.book_id,
            }
        )
        item = item_in.model_dump(by_alias=True)
        if user_book is None:
            user_book = super().save(UserBookCreate(**item))

        if user_book.reading_status == ReadStatus.NOT_STARTED:
            item["readingStatus"] = ReadStatus.CURRENTLY_READING

        item["id"] = user_book.id
        return self.update(UserBookUpdate(**item))
