import uuid
from typing import Any
from fastapi import APIRouter, HTTPException

from app.api.models.user import User, UserUpdate, UserPublic
from app.api.deps import SessionDep
from app.api.models.response import Response, send_ok, send_error

router = APIRouter(prefix="/user", tags=["User"])

@router.post("/", response_model=Response[UserPublic])
def create(user: User, session: SessionDep) -> Any:
    """
    Create a new user
    """
    session.add(user)
    session.commit()
    session.refresh(user)
    return send_ok(user)

@router.get("/", response_model=Response[UserPublic])
def get(id: uuid.UUID, session: SessionDep) -> Any:
    """
    Get a user
    """
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return send_ok(user)

@router.put("/", response_model=Response[UserPublic])
def update(data: UserUpdate, session: SessionDep) -> Any:
    """
    Update a user
    """
    id = data.id
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    update_dict = data.model_dump(exclude_unset=True)
    user.sqlmodel_update(update_dict)
    session.add(user)
    session.commit()
    session.refresh(user)
    return send_ok(user)

@router.delete("/")
def delete(id: uuid.UUID, session: SessionDep) -> Any:
    """
    Delete a user
    """
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return send_ok()
