import enum
import uuid
from datetime import datetime

from sqlalchemy import Integer, String, text
from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, time_field, uuid_field


class ReadStatus(enum.IntEnum):
    NOT_STARTED = 0
    WANT_TO_READ = 1
    CURRENTLY_READING = 2
    FINISHED = 3


class UserBook(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "user_book"
    __table_args__ = (
        UniqueConstraint("user_id", "book_id", name="unique_user_book"),
    )

    book_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    rating: int | None = Field(default=0, ge=0, le=5)
    reading_position: str | None = Field(default="")
    reading_percentage: float | None = Field(default=0.0, ge=0.0, le=100.0)
    reading_status: int = Field(
        default=ReadStatus.NOT_STARTED, ge=0, le=3,
        sa_type=Integer,
        sa_column_kwargs={"server_default": text(str(ReadStatus.NOT_STARTED))}
    )
    reading_status_time: datetime | None = time_field()
    tags: str = Field(
        default="[]",
        sa_type=String,
        sa_column_kwargs={"server_default": "[]"}
    )


class UserBookBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID | None = None
    book_id: uuid.UUID | None = None
    rating: int | None = 0
    reading_position: str | None = ""
    reading_percentage: float | None = 0.0
    reading_status: int | None = None


class UserBookCreate(UserBookBase):
    pass


class UserBookUpdate(UserBookBase):
    id: uuid.UUID


class UserBookUpdateReadingProgress(BaseApiModel):
    book_id: uuid.UUID
    reading_position: str
    reading_percentage: float
    reading_status: int | None = None


class UserBookPublic(UserBookCreate, BaseMixin):
    pass


class UserBookDetails(UserBookPublic):
    owner: uuid.UUID
    title: str
    path: str | None = None
    file_name: str | None = None
    cover_name: str | None = None
    author: str | None = None
    language: str | None = None
    description: str | None = None
    publisher: str | None = None
    published: str | None = None
    extension: str | None = None
    scope: int
    book_rating: int


class WorkspaceCollectionBookDetails(UserBookDetails):
    tid: uuid.UUID | None = None
