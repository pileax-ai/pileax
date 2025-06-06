from app.api.models.note import Note
from app.api.repos.base_repository import BaseRepository


class NoteRepository(BaseRepository[Note]):
    model = Note
