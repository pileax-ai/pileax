import uuid

from sqlalchemy import Column, UniqueConstraint
from sqlmodel import Field

from app.api.models.common import BaseApiModel, BaseSQLModel, UUIDString, TimestampMixin


class UserBook(BaseSQLModel, TimestampMixin, table=True):
    __tablename__ = "user_book"

    __table_args__ = (
        UniqueConstraint("user_id", "book_id", name="uq_user_book"),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), primary_key=True)
    )
    user_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), nullable=False)
    )
    book_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), nullable=False)
    )
    rating: int | None = Field(default=0, ge=0, le=5)
    reading_position: str | None = Field(default="")
    reading_percentage: float | None = Field(default=0.0, ge=0.0, le=100.0)


class UserBookBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    book_id: uuid.UUID | None = None
    rating: int | None = 0
    reading_position: str | None = ""
    reading_percentage: float | None = 0.0


class UserBookCreate(UserBookBase):
    pass


class UserBookUpdate(UserBookBase):
    id: uuid.UUID


class UserBookPublic(UserBookCreate, TimestampMixin):
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
    scope: int
    book_rating: int
