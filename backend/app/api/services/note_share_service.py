from fastapi import HTTPException

from app.api.models.note_share import NoteShare, NoteShareDetails
from app.api.repos.note_share_repository import NoteShareRepository
from app.api.services.base_service import BaseService


class NoteShareService(BaseService[NoteShare]):
    def __init__(self, session):
        super().__init__(NoteShare, session, NoteShareRepository)

    def get_details(self, share_id: str) -> NoteShareDetails:
        details = self.repo.get_details(share_id)
        if not details:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return details
