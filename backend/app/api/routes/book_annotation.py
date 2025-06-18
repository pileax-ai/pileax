from typing import Any, List
from uuid import UUID

from app.api.controllers.book_annotation_controller import BookAnnotationController
from app.api.router import ApiRouter

from app.api.deps import SessionDep, CurrentUserId
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.book_annotation import BookAnnotationCreate, BookAnnotationUpdate, BookAnnotationPublic, \
    BookAnnotationDetails

router = ApiRouter(prefix="/book/annotation", tags=["BookAnnotation"])


@router.api_post("", response_model=BookAnnotationPublic)
def save(item_in: BookAnnotationCreate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookAnnotationController(session, user_id).save(item_in)


@router.api_get("", response_model=BookAnnotationPublic)
def get(id: UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookAnnotationController(session, user_id).get(id)


@router.api_put("", response_model=BookAnnotationPublic)
def update(item_in: BookAnnotationUpdate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookAnnotationController(session, user_id).update(item_in)


@router.api_delete("")
def delete(id: UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookAnnotationController(session, user_id).delete(id)


@router.api_post("/query", response_model=QueryResult[BookAnnotationPublic])
def query(query: PaginationQuery, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookAnnotationController(session, user_id).query(query)


@router.api_post("/query/details", response_model=QueryResult[BookAnnotationDetails])
def query_details(query: PaginationQuery, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookAnnotationController(session, user_id).query_details(query)


@router.api_get("/all", response_model=List[BookAnnotationPublic])
def find_all_by_book(id: str, session: SessionDep, user_id: CurrentUserId) -> Any:
    return BookAnnotationController(session, user_id).find_all_by_book(id)
