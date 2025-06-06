from collections.abc import Generator
from typing import Annotated
from uuid import UUID

from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from fastapi import Depends

from app.core.config import settings
from app.core.database.sqlite import engine

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/signin"
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]

# constants
DEFAULT_USER_ID: UUID = UUID('00000000-0000-0000-0000-000000000000')
