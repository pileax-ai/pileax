import enum
import uuid

from sqlalchemy import Integer, String, text
from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field

class ReadStatus(enum.IntEnum):
    NOT_STARTED = 0
    WANT_TO_READ = 1
    CURRENTLY_READING = 2
    FINISHED = 3

class TenantBook(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "tenant_book"

    __table_args__ = (
        UniqueConstraint("tenant_id", "book_id", name="unique_tenant_book"),
    )

    tenant_id: uuid.UUID = uuid_field()
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
    reading_status_time: str | None = Field(default=None)
    tags: str = Field(
        default="[]",
        sa_type=String,
        sa_column_kwargs={"server_default": "[]"}
    )


class TenantBookBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID | None = None
    book_id: uuid.UUID
    tenant_id: uuid.UUID | None = None
    rating: int | None = 0
    reading_position: str | None = ""
    reading_percentage: float | None = 0.0


class TenantBookCreate(TenantBookBase):
    pass


class TenantBookUpdate(TenantBookBase):
    id: uuid.UUID


class TenantBookPublic(TenantBookCreate, BaseMixin):
    pass

class TenantBookDetails(TenantBookPublic):
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
