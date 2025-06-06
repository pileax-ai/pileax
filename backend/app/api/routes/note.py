import uuid
from typing import Any

from app.api.router import ApiRouter

from app.api.deps import SessionDep, CurrentUser
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.note import Note, NoteCreate, NoteUpdate, NotePublic
from app.api.services.note_service import NoteService

router = ApiRouter(prefix="/note", tags=["Note"])


@router.api_post("/", response_model=NotePublic)
def save(item_in: NoteCreate, session: SessionDep, current_user: CurrentUser) -> Any:
    item = Note.model_validate(
        item_in.model_dump(by_alias=True),
        update={"userId": str(current_user.id)}
    )
    return NoteService(session).save(item)


@router.api_get("/", response_model=NotePublic)
def get(id: uuid.UUID, session: SessionDep) -> Any:
    return NoteService(session).get(id)


@router.api_put("/", response_model=NotePublic)
def update(item_in: NoteUpdate, session: SessionDep) -> Any:
    return NoteService(session).update(item_in.id, item_in.model_dump(exclude_unset=True))


@router.api_delete("/")
def delete(id: uuid.UUID, session: SessionDep) -> Any:
    NoteService(session).delete(id)


@router.api_post("/query", response_model=QueryResult[NotePublic])
def query(query: PaginationQuery, session: SessionDep) -> Any:
    return NoteService(session).query(query)
