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
def save(user_create: UserCreate, session: SessionDep, token: TokenDep) -> Any:
    user = User(**user_create.model_dump())
    service = UserService(session)
    service.save(user)
    return send_ok(user)


@router.get("/", response_model=Response[UserPublic])
def get(id: uuid.UUID, session: SessionDep) -> Any:
    service = UserService(session)
    user = service.get(id)
    return send_ok(user)


@router.put("/", response_model=Response[UserPublic])
def update(data: UserUpdate, session: SessionDep) -> Any:
    service = UserService(session)
    update_dict = data.model_dump(exclude_unset=True)
    user = service.update(data.id, update_dict)
    return send_ok(user)


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
