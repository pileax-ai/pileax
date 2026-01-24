from app.api.models.note_version import NoteVersion
from app.api.repos.base_repository import BaseRepository


class NoteVersionRepository(BaseRepository[NoteVersion]):
    def __init__(self, model, session):
        super().__init__(model, session)
