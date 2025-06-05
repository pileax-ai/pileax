import uuid

from sqlalchemy import Column
from sqlmodel import SQLModel, Field, Session
from app.api.models.common import UUIDString

class User(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), primary_key=True)
    )
    name: str = Field(index=True)
    avatar: str | None = Field(default=None)
    bio: str | None = Field(default=None)

class UserUpdate(SQLModel):
    id: uuid.UUID
    name: str = Field(default=None)
    avatar: str | None = Field(default=None)
    bio: str | None = Field(default=None)

class UserPublic(SQLModel):
    id: uuid.UUID
    name: str = Field(default=None)
    avatar: str | None = Field(default=None)
