import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.note_share_controller import NoteShareController
from app.api.controllers.note_share_public_controller import NoteSharePublicController
from app.api.models.note_share import NoteShareCreate, NoteSharePublic, NoteShareUpdate, NoteShareDetails
from app.api.router import ApiRouter

router = ApiRouter(prefix="/note/share", tags=["NoteShare"])


@router.api_post("", response_model=NoteSharePublic)
async def save(item_in: NoteShareCreate, controller: NoteShareController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=NoteSharePublic)
async def get(id: uuid.UUID, controller: NoteShareController = Depends()) -> Any:
    return controller.get(id)


@router.api_get("/by-note", response_model=NoteSharePublic)
async def get_by_note(note_id: uuid.UUID, controller: NoteShareController = Depends()) -> Any:
    return controller.get_by_note(note_id)


@router.api_put("", response_model=NoteSharePublic)
async def update(item_in: NoteShareUpdate, controller: NoteShareController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
async def delete(id: uuid.UUID, controller: NoteShareController = Depends()) -> Any:
    return controller.delete(id)


@router.api_get("/details", response_model=NoteShareDetails)
async def get_details(share_id: str, controller: NoteSharePublicController = Depends()) -> Any:
    return controller.get_details(share_id)
