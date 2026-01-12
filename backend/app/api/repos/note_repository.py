from app.api.models.note import Note
from app.api.repos.base_repository import BaseRepository


class NoteRepository(BaseRepository[Note]):
    def __init__(self, model, session):
        super().__init__(model, session)
