from app.api.models.note_share import NoteShare
from app.api.repos.base_repository import BaseRepository


class NoteShareRepository(BaseRepository[NoteShare]):
    def __init__(self, model, session):
        super().__init__(model, session)
