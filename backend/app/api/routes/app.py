import uuid
from typing import Any

from app.api.controllers.app_controller import AppController
from app.api.router import ApiRouter

from app.api.deps import SessionDep, CurrentUserId
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.app import AppCreate, AppUpdate, AppPublic

router = ApiRouter(prefix="/app", tags=["App"])


@router.api_post("", response_model=AppPublic)
def save(item_in: AppCreate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return AppController(session, user_id).save(item_in)


@router.api_get("", response_model=AppPublic)
def get(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return AppController(session, user_id).get(id)


@router.api_put("", response_model=AppPublic)
def update(item_in: AppUpdate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return AppController(session, user_id).update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return AppController(session, user_id).delete(id)


@router.api_post("/query", response_model=QueryResult[AppPublic])
def query(query: PaginationQuery, session: SessionDep, user_id: CurrentUserId) -> Any:
    return AppController(session, user_id).query(query)
