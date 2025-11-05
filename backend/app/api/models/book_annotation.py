import uuid

from sqlalchemy import Column
from sqlmodel import Field

from app.api.models.common import BaseApiModel, BaseSQLModel, UUIDString, TimestampMixin


class BookAnnotation(BaseSQLModel, TimestampMixin, table=True):
    __tablename__ = "book_annotation"

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
    user_book_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), nullable=False)
    )
    type: str | None = Field(default=None)
    value: str | None = Field(default=None)
    note: str | None = Field(default=None)
    color: str | None = Field(default=None)
    chapter: str | None = Field(default=None)
    page: int | None = Field(default=0, ge=0)


class BookAnnotationBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    type: str | None = None
    value: str | None = None
    note: str | None = None
    color: str | None = None
    chapter: str | None = None
    page: int | None = 0


class BookAnnotationCreate(BookAnnotationBase):
    book_id: uuid.UUID | None = None
    user_book_id: uuid.UUID | None = None


class BookAnnotationUpdate(BookAnnotationBase):
    id: uuid.UUID


class BookAnnotationPublic(BookAnnotationCreate, TimestampMixin):
    pass


class BookAnnotationDetails(BookAnnotationPublic):
    book_title: str
    path: str | None = None
    file_name: str | None = None
    cover_name: str | None = None
