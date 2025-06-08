import uuid
from typing import Any, List

from app.api.controllers.user_book_controller import UserBookController
from app.api.router import ApiRouter
from app.api.deps import SessionDep, CurrentUserId
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user_book import UserBookCreate, UserBookUpdate, UserBookPublic, UserBookDetails

router = ApiRouter(prefix="/user/book", tags=["UserBook"])


@router.api_post("/", response_model=UserBookPublic)
def save(item_in: UserBookCreate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return UserBookController(session, user_id).save(item_in)


@router.api_get("/", response_model=UserBookPublic)
def get(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return UserBookController(session, user_id).get(id)


@router.api_put("/", response_model=UserBookPublic)
def update(item_in: UserBookUpdate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return UserBookController(session, user_id).update(item_in)


@router.api_delete("/")
def delete(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return UserBookController(session, user_id).delete(id)


@router.api_post("/query", response_model=QueryResult[UserBookPublic])
def query(query: PaginationQuery, session: SessionDep, user_id: CurrentUserId) -> Any:
    return UserBookController(session, user_id).query(query)


@router.api_get("/details", response_model=UserBookDetails)
def get_details(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return UserBookController(session, user_id).get_details(id)


@router.api_post("/query/details", response_model=QueryResult[UserBookDetails])
def query_details(query: PaginationQuery, session: SessionDep, user_id: CurrentUserId) -> Any:
    return UserBookController(session, user_id).query_details(query)
