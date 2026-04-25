from app.api.models.note_share import NoteShare
from app.api.repos.note_share_repository import NoteShareRepository
from app.api.services.base_service import BaseService
from app.api.models.note_share import NoteShareDetails


class NoteShareService(BaseService[NoteShare]):
    def __init__(self, session):
        super().__init__(NoteShare, session, NoteShareRepository)

    def get_details(self, share_id: str) -> NoteShareDetails:
        return self.repo.get_details(share_id)
