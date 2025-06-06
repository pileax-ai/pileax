import uuid

from sqlalchemy import Column
from sqlmodel import Field, SQLModel
from pydantic import BaseModel

from app.api.models.common import BaseSQLModel, UUIDString, TimestampMixin


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str | None = None
