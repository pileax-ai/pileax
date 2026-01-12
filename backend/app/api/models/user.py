import uuid
from datetime import datetime

from sqlmodel import Column, Field, Integer

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, time_field
from app.api.models.enums import Status


class User(BaseSQLModel, BaseMixin, table=True):
    name: str = Field(..., max_length=100)
    email: str = Field(..., max_length=255, unique=True)
    password: str = Field(..., max_length=255)
    password_salt: str = Field(default=None, max_length=255)
    avatar: str | None = Field(default=None, max_length=255)
    bio: str | None = Field(default=None, max_length=255)
    timezone: str | None = Field(default=None, max_length=255)
    status: int | None = Field(default=1, sa_column=Column(Integer, default=Status.ACTIVE))
    settings: str | None = Field(default=None, description="UI settings")
    last_login_time: datetime | None = time_field()
    last_login_ip: str | None = Field(default=None, max_length=64)
    last_active_time: datetime | None = time_field()


class UserBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    avatar: str | None = None
    bio: str | None = None


class UserCreate(BaseApiModel):
    name: str
    email: str
    password: str


class UserUpdate(UserBase):
    id: uuid.UUID
    name: str | None = None


class UserPublic(UserCreate, BaseMixin):
    pass
