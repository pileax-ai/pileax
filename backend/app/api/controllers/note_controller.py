import uuid

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspaceId, SessionDep
from app.api.models.note import Note, NoteCreate, NoteUpdate


class NoteController(BaseController[Note, NoteCreate, NoteUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId,
    ):
        super().__init__(Note, session, user_id, workspace_id)

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
