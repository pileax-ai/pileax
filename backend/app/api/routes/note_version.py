import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.note_version_controller import NoteVersionController
from app.api.models.note_version import NoteVersionCreate, NoteVersionDetails, NoteVersionPublic, NoteVersionUpdate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.router import ApiRouter

router = ApiRouter(prefix="/note/version", tags=["NoteVersion"])


@router.api_post("", response_model=NoteVersionPublic)
async def save(item_in: NoteVersionCreate, controller: NoteVersionController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=NoteVersionPublic)
async def get(id: uuid.UUID, controller: NoteVersionController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=NoteVersionPublic)
async def update(item_in: NoteVersionUpdate, controller: NoteVersionController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
async def delete(id: uuid.UUID, controller: NoteVersionController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[NoteVersionPublic])
async def query(query: PaginationQuery, controller: NoteVersionController = Depends()) -> Any:
    return controller.query(query)


@router.api_post("/query/details", response_model=QueryResult[NoteVersionDetails])
async def query_details(query: PaginationQuery, controller: NoteVersionController = Depends()) -> Any:
    return controller.query_details(query)
