from app.api.deps import SessionDep
from app.api.models.note_share import NoteShareDetails
from app.api.services.note_share_service import NoteShareService


class NoteSharePublicController:
    def __init__(self, session: SessionDep):
        self.service = NoteShareService(session)

    def get_details(self, share_id: str) -> NoteShareDetails:
        return self.service.get_details(share_id)

