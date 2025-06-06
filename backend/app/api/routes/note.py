import uuid
from typing import Any
from fastapi import APIRouter

from app.api.deps import SessionDep, CurrentUser
from app.api.models.response import Response, send_ok
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.note import Note, NoteCreate, NoteUpdate, NotePublic
from app.api.services.note_service import NoteService

router = APIRouter(prefix="/note", tags=["Note"])


@router.post("/", response_model=Response[NotePublic])
def save(item_in: NoteCreate, session: SessionDep, current_user: CurrentUser) -> Any:
    item = Note.model_validate(
        item_in.model_dump(by_alias=True),
        update={"userId": str(current_user.id)}
    )
    service = NoteService(session)
    service.save(item)
    return send_ok(item)


@router.get("/", response_model=Response[NotePublic])
def get(id: uuid.UUID, session: SessionDep) -> Any:
    service = NoteService(session)
    item = service.get(id)
    return send_ok(item)


@router.put("/", response_model=Response[NotePublic])
def update(item_in: NoteUpdate, session: SessionDep) -> Any:
    service = NoteService(session)
    item = service.update(item_in.id, item_in.model_dump(exclude_unset=True))
    return send_ok(item)


@router.delete("/", response_model=Response)
def delete(id: uuid.UUID, session: SessionDep) -> Any:
    service = NoteService(session)
    service.delete(id)
    return send_ok()


@router.post("/query", response_model=Response[QueryResult[NotePublic]])
def query(query: PaginationQuery, session: SessionDep) -> Any:
    service = NoteService(session)
    res = service.query(query)
    return send_ok(res)
