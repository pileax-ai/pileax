from collections.abc import Generator
from typing import Annotated
from uuid import UUID

from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session
from fastapi import Depends, HTTPException, status

from app.api.models.auth import TokenPayload
from app.api.models.user import User
from app.core.config import settings
from app.core.database.sqlite import engine
from app.libs.jwt_service import JWTService

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token"
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_user_id(token: TokenDep) -> UUID:
    try:
        payload = JWTService().decode(token)
        token_data = TokenPayload(**payload)
        return UUID(token_data.sub)
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    try:
        payload = JWTService().decode(token)
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # if not user.is_active:
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentUserId = Annotated[User, Depends(get_user_id)]
