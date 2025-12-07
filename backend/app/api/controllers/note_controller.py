from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentWorkspaceId, SessionDep, CurrentUserId
from app.api.models.note import Note, NoteCreate, NoteUpdate


class NoteController(BaseController[Note, NoteCreate, NoteUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId,
    ):
        super().__init__(Note, session, user_id, workspace_id)
