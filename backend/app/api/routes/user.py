import uuid
from typing import Any
from fastapi import APIRouter

from app.api.deps import SessionDep, TokenDep
from app.api.models.response import Response, send_ok
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user import User, UserCreate, UserUpdate, UserPublic
from app.api.services.user_service import UserService

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/", response_model=Response[UserPublic])
def save(item_in: UserCreate, session: SessionDep, token: TokenDep) -> Any:
    item = User(**item_in.model_dump(by_alias=True))
    service = UserService(session)
    service.save(item)
    return send_ok(item)


@router.get("/", response_model=Response[UserPublic])
def get(id: uuid.UUID, session: SessionDep) -> Any:
    service = UserService(session)
    item = service.get(id)
    return send_ok(item)


@router.put("/", response_model=Response[UserPublic])
def update(item_in: UserUpdate, session: SessionDep) -> Any:
    service = UserService(session)
    item = service.update(item_in.id, item_in.model_dump(exclude_unset=True))
    return send_ok(item)


@router.delete("/", response_model=Response)
def delete(id: uuid.UUID, session: SessionDep) -> Any:
    service = UserService(session)
    service.delete(id)
    return send_ok()


@router.post("/query", response_model=Response[QueryResult[UserPublic]])
def query(query: PaginationQuery, session: SessionDep) -> Any:
    service = UserService(session)
    res = service.query(query)
    return send_ok(res)
