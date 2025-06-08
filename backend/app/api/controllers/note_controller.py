from typing import Optional

from app.api.controllers.base_controller import BaseController
from app.api.models.note import Note, NoteCreate, NoteUpdate

class NoteController(BaseController[Note, NoteCreate, NoteUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(Note, session, user_id)
