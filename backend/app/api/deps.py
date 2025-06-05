from collections.abc import Generator
from typing import Annotated
from sqlmodel import Session
from fastapi import Depends

from app.core.database.sqlite import engine

def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_db)]
