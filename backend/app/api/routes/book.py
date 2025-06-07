import uuid
from typing import Any

from app.api.controllers.book_controller import BookController
from app.api.router import ApiRouter

from app.api.deps import SessionDep, CurrentUserId
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.book import BookCreate, BookUpdate, BookPublic

router = ApiRouter(prefix="/book", tags=["Book"])


@router.api_post("/", response_model=BookPublic)
def save(item_in: BookCreate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookController(session, user_id).save(item_in)


@router.api_get("/", response_model=BookPublic)
def get(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookController(session, user_id).get(id)


@router.api_put("/", response_model=BookPublic)
def update(item_in: BookUpdate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookController(session, user_id).update(item_in)


@router.api_delete("/")
def delete(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookController(session, user_id).delete(id)


@router.api_post("/query", response_model=QueryResult[BookPublic])
def query(query: PaginationQuery, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookController(session, user_id).query(query)
