import enum
import uuid
from datetime import datetime

from sqlalchemy import Integer, text
from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, JSONString, time_field, uuid_field
from app.api.models.enums import Status


class ReadStatus(enum.IntEnum):
    NOT_STARTED = 0
    WANT_TO_READ = 1
    CURRENTLY_READING = 2
    FINISHED = 3


class UserBook(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "user_book"
    __table_args__ = (UniqueConstraint("user_id", "book_id", name="unique_user_book"),)

    book_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    is_removed: int = Field(
        default=Status.INACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.INACTIVE))}
    )

    # Reading
    reading_position: str | None = Field(default="")
    reading_percentage: float | None = Field(default=0.0, ge=0.0, le=100.0)
    reading_status: int = Field(
        default=ReadStatus.NOT_STARTED,
        ge=0,
        le=3,
        sa_type=Integer,
        sa_column_kwargs={"server_default": text(str(ReadStatus.NOT_STARTED))},
    )
    reading_status_time: datetime | None = time_field()
    rating: float | None = Field(default=0.0, ge=0.0, le=10.0)
    extra: dict | None = Field(default=None, sa_type=JSONString)

    # Copies
    is_physical: int = Field(
        default=Status.INACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.INACTIVE))}
    )
    location: str | None = Field(default=None)
    code: str | None = Field(default=None)
    is_weread: int = Field(
        default=Status.INACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.INACTIVE))}
    )


class UserBookBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID | None = None
    book_id: uuid.UUID | None = None
    reading_position: str | None = ""
    reading_percentage: float | None = 0.0
    reading_status: int | None = None
    rating: float | None = 0.0
    is_physical: int | None = None
    location: str | None = None
    code: str | None = None
    is_weread: int | None = None
    extra: dict | None = None


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
    file_url: str | None = None
    cover_url: str | None = None
    author: str | None = None
    language: str | None = None
    description: str | None = None
    publisher: str | None = None
    published: str | None = None
    extension: str | None = None
    scope: int
    book_rating: float | None = 0.0


class WorkspaceCollectionBookDetails(UserBookDetails):
    tid: uuid.UUID | None = None
