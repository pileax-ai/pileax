from typing import Any
from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.enums import Status
from app.api.models.note_share import NoteShare, NoteShareCreate, NoteShareUpdate
from app.api.models.owner import Owner
from app.api.services.note_service import NoteService
from app.libs.helper import StringHelper


class NoteShareController(BaseController[NoteShare, NoteShareCreate, NoteShareUpdate]):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(NoteShare, session, user, workspace)
        self.note_service = NoteService(session)

    def get_by_note(self, note_id: UUID) -> NoteShare:
        return self.service.find_one({
            "user_id": self.user.id,
            "note_id": note_id,
            "is_active": Status.ACTIVE,
        }, raise_exception=True)

    def save(self, item_in: NoteShareCreate) -> NoteShare:
        note = self.note_service.get_by_owner(Owner(
            user_id=self.user.id,
            workspace=self.workspace
        ), item_in.note_id)
        note_share = super().find_one({
            "user_id": self.user.id,
            "note_id": note.id,
        })

        if note_share:
            return super().update(NoteShareUpdate(
                id=note_share.id,
                is_active=Status.ACTIVE
            ))
        else:
            item_in.share_id = StringHelper.generate_share_id(note.title)
            return super().save(item_in)

    def delete(self, id: UUID) -> Any:
        note_share = super().get(id)
        super().update(NoteShareUpdate(
            id=id,
            is_active=Status.INACTIVE
        ))
