from sqlalchemy import select

from app.api.models.enums import Status
from app.api.models.note import Note
from app.api.models.note_share import NoteShare
from app.api.repos.base_repository import BaseRepository


class NoteShareRepository(BaseRepository[NoteShare]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_details(self, share_id: str) -> dict | None:
        stmt = (
            select(NoteShare, Note)
            .join(Note, Note.id == NoteShare.note_id, isouter=True)
            .filter(
                NoteShare.share_id == share_id,
                NoteShare.is_active == Status.ACTIVE,
            )
        )
        result = self.session.exec(stmt).first()
        if result:
            note_share, note = result
            return self.build_details(note_share, note)
        return None

    @staticmethod
    def build_details(note_share: NoteShare, note: Note) -> dict:
        return {
            **note_share.model_dump(),
            "title": note.title if note else None,
            "content": note.content if note else None,
            "icon": note.icon if note else None,
            "cover": note.cover if note else None,
            "styles": note.styles if note else None,
        }
