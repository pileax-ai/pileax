import uuid
from typing import Any

from fastapi import APIRouter

from app.api.deps import SessionDep
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user import UserPublic, UserUpdate
from app.api.router import Response, send_ok
from app.api.services.user_service import UserService

router = APIRouter(prefix="/user", tags=["User"])


@router.get("", response_model=Response[UserPublic])
async def get(id: uuid.UUID, session: SessionDep) -> Any:
    service = UserService(session)
    item = service.get(id)
    return send_ok(item)


@router.put("", response_model=Response[UserPublic])
async def update(item_in: UserUpdate, session: SessionDep) -> Any:
    service = UserService(session)
    item = service.update(item_in.id, item_in.model_dump(exclude_unset=True))
    return send_ok(item)


@router.delete("", response_model=Response)
async def delete(id: uuid.UUID, session: SessionDep) -> Any:
    service = UserService(session)
    service.delete(id)
    return send_ok()


@router.post("/query", response_model=Response[QueryResult[UserPublic]])
async def query(query: PaginationQuery, session: SessionDep) -> Any:
    service = UserService(session)
    res = service.query(query)
    return send_ok(res)
