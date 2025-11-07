from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentTenantId, SessionDep, CurrentUserId
from app.api.models.note import Note, NoteCreate, NoteUpdate


class NoteController(BaseController[Note, NoteCreate, NoteUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId,
    ):
        super().__init__(Note, session, tenant_id, user_id)
