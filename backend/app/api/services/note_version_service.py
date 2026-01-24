from app.api.models.note_version import NoteVersion
from app.api.repos.note_version_repository import NoteVersionRepository
from app.api.services.base_service import BaseService


class NoteVersionService(BaseService[NoteVersion]):
    def __init__(self, session):
        super().__init__(NoteVersion, session, NoteVersionRepository)
