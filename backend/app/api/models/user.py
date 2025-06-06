import uuid

from sqlalchemy import Column
from sqlmodel import Field
from pydantic import BaseModel

from app.api.models.common import BaseSQLModel, UUIDString, TimestampMixin


class User(BaseSQLModel, TimestampMixin, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), primary_key=True)
    )
    name: str = Field(..., max_length=100)
    avatar: str | None = Field(default=None, max_length=255)
    bio: str | None = Field(default=None, max_length=255)


class UserBase(BaseModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    avatar: str | None = None
    bio: str | None = None


class UserCreate(UserBase):
    name: str


class UserUpdate(UserBase):
    id: uuid.UUID
    name: str | None = None


class UserPublic(UserCreate, TimestampMixin):
    pass
