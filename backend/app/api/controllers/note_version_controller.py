
from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspaceId, SessionDep
from app.api.models.note_version import NoteVersion, NoteVersionCreate, NoteVersionUpdate


class NoteVersionController(BaseController[NoteVersion, NoteVersionCreate, NoteVersionUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId,
    ):
        super().__init__(NoteVersion, session, user_id, workspace_id)
