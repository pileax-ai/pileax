import uuid

from sqlalchemy import Column
from sqlmodel import Field

from app.api.models.common import BaseApiModel, BaseSQLModel, UUIDString, TimestampMixin


class Book(BaseSQLModel, TimestampMixin, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), primary_key=True)
    )
    user_id: str = Field(..., max_length=64, description="Owner's ID")
    uuid: str = Field(..., max_length=64, unique=True, description="Book unique ID")
    title: str = Field(..., max_length=255, description="Book title")
    path: str = Field(..., description="Book file path")
    file_name: str | None = Field(default=None)
    cover_name: str | None = Field(default=None)
    extension: str | None = Field(default=None)
    rating: int | None = Field(default=0, ge=0, le=5)
    author: str | None = Field(default=None)
    language: str | None = Field(default=None)
    description: str | None = Field(default=None)
    publisher: str | None = Field(default=None)
    published: str | None = Field(default=None)
    scope: int | None = Field(default=9, ge=0, le=9, description="View scope: 0.offline; 1.owner only; 9.all users")


class BookBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    title: str
    author: str | None = None
    language: str | None = None
    description: str | None = None
    publisher: str | None = None
    published: str | None = None

class BookCreate(BookBase):
    uuid: str
    path: str
    file_name: str
    cover_name: str | None = None
    extension: str | None = None


class BookUpdate(BookBase):
    id: uuid.UUID
    title: str | None = None


class BookPublic(BookCreate, TimestampMixin):
    pass
