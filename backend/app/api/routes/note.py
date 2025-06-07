import uuid
from typing import Any

from app.api.controllers.note_controller import NoteController
from app.api.router import ApiRouter

from app.api.deps import SessionDep, CurrentUserId
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.note import NoteCreate, NoteUpdate, NotePublic

router = ApiRouter(prefix="/note", tags=["Note"])


@router.api_post("/", response_model=NotePublic)
def save(item_in: NoteCreate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return NoteController(session, user_id).save(item_in)


@router.api_get("/", response_model=NotePublic)
def get(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return NoteController(session, user_id).get(id)


@router.api_put("/", response_model=NotePublic)
def update(item_in: NoteUpdate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return NoteController(session, user_id).update(item_in)


@router.api_delete("/")
def delete(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return NoteController(session, user_id).delete(id)


@router.api_post("/query", response_model=QueryResult[NotePublic])
def query(query: PaginationQuery, session: SessionDep, user_id: CurrentUserId) -> Any:
    return NoteController(session, user_id).query(query)
