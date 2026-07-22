import uuid
from typing import Any

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.note import Note, NoteCreate, NoteUpdate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.services.note_service import NoteService


class NoteController(BaseController[Note, NoteCreate, NoteUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user: CurrentUser,
        workspace: CurrentWorkspace,
    ):
        super().__init__(Note, session, user, workspace)
        self.service = NoteService(session)

    def save(self, item_in: NoteCreate) -> Any:
        item_in.last_edit_by = self.user.id
        return super().save(item_in)

    def duplicate(self, id: uuid.UUID) -> Note:
        note = super().get(id)
        return super().save(
            NoteCreate(
                parent=note.parent,
                title=f"{note.title}(1)",
                content=note.content,
                icon=note.icon,
                cover=note.cover,
                styles=note.styles,
                doc=note.doc,
            )
        )

    def query_my(self, query: PaginationQuery) -> QueryResult[Note]:
        """
        Query my notes in current workspace
        1. Note created by myself
        2. Note shared by team
        """
        query.condition["workspaceId"] = self.workspace_id
        return self.service.query_my(query, self.user.id)

    def find_all_by_workspace(self) -> list:
        """
        Find all my notes in current workspace
        1. Note created by myself
        2. Note shared by team
        """
        return self.service.find_all_by_workspace(self.user.id, self.workspace_id)
