import uuid

from app.api.models.note import Note
from app.api.repos.note_repository import NoteRepository
from app.api.services.base_service import BaseService

class NoteService(BaseService[Note]):
    def __init__(self, session):
        super().__init__(session, NoteRepository)
