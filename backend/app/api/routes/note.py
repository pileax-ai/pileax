import uuid
from typing import Any, List

from fastapi import Depends

from app.api.controllers.note_controller import NoteController
from app.api.router import ApiRouter

from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.note import NoteCreate, NoteUpdate, NotePublic

router = ApiRouter(prefix="/note", tags=["Note"])


@router.api_post("", response_model=NotePublic)
def save(item_in: NoteCreate, controller: NoteController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=NotePublic)
def get(id: uuid.UUID, controller: NoteController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=NotePublic)
def update(item_in: NoteUpdate, controller: NoteController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: NoteController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[NotePublic])
def query(query: PaginationQuery, controller: NoteController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/all", response_model=List[NotePublic])
def find_all(controller: NoteController = Depends()) -> Any:
    return controller.find_all_by_owner()
