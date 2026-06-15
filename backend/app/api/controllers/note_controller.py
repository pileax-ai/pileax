import uuid
from typing import Any

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.note import Note, NoteCreate, NoteUpdate


class NoteController(BaseController[Note, NoteCreate, NoteUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user: CurrentUser,
        workspace: CurrentWorkspace,
    ):
        super().__init__(Note, session, user, workspace)

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
