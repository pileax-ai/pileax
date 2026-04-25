from app.api.models.note_share import NoteShare
from app.api.repos.note_share_repository import NoteShareRepository
from app.api.services.base_service import BaseService


class NoteShareService(BaseService[NoteShare]):
    def __init__(self, session):
        super().__init__(NoteShare, session, NoteShareRepository)
