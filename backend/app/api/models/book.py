import enum
import uuid

from pydantic import field_validator
from sqlalchemy import Index, Integer, UniqueConstraint, event, text
from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, JSONString, uuid_field
from app.api.models.enums import Scope
from app.libs.db_helper import DbHelper


class Book(BaseSQLModel, BaseMixin, table=True):
    __table_args__ = (
        UniqueConstraint("tenant_id", "uuid", name="unique_tenant_book"),
        Index("idx_tenant_isbn", "tenant_id", "isbn"),
    )

    tenant_id: uuid.UUID = uuid_field()
    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()

    # Basic
    uuid: str = Field(..., min_length=32, max_length=64, description="Book sha1 hash")
    title: str = Field(..., max_length=255, description="Book title")
    subtitle: str | None = Field(default=None, max_length=255, description="Book subtitle")
    title_pinyin: str | None = Field(default=None)
    author: str | None = Field(default=None)
    language: str | None = Field(default=None)
    description: str | None = Field(default=None)
    publisher: str | None = Field(default=None)
    published: str | None = Field(default=None)
    rating: float | None = Field(default=0.0, ge=0.0, le=10.0)
    ref_url: str | None = Field(default=None)

    # File
    path: str = Field(..., description="Book file path")
    file_url: str | None = Field(default=None)
    cover_url: str | None = Field(default=None)
    size: int | None = Field(default=0, ge=0)
    extension: str | None = Field(default=None)
    media: dict | None = Field(default=None, sa_type=JSONString)

    # Category
    isbn: str | None = Field(default=None)
    clc_code: str | None = Field(default=None)
    ddc_code: str | None = Field(default=None)

    # Share
    scope: int | None = Field(
        default=Scope.WORKSPACE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Scope.WORKSPACE))}
    )


@event.listens_for(Book, "before_insert")
def before_insert(mapper, connection, target: Book):
    target.title_pinyin = DbHelper.to_pinyin(target.title)


@event.listens_for(Book, "before_update")
def before_update(mapper, connection, target: Book):
    target.title_pinyin = DbHelper.to_pinyin(target.title)


class BookMediaType(enum.StrEnum):
    DIGITAL = "digital"
    PHYSICAL = "physical"


class BookMedia(BaseApiModel):
    type: BookMediaType = BookMediaType.DIGITAL
    sha1: str = Field(..., min_length=32, max_length=64, description="Book sha1 hash")
    format: str | None = None
    file_url: str | None = Field(default=None)
    cover_url: str | None = Field(default=None)
    size: int | None = Field(default=0, ge=0)


class BookBase(BaseApiModel):
    title: str
    subtitle: str | None = None
    author: str | None = None
    language: str | None = None
    description: str | None = None
    publisher: str | None = None
    published: str | None = None
    rating: float | None = 0.0
    media: list[BookMedia] | None = Field(default_factory=list)
    isbn: str | None = None
    cover_url: str | None = ""
    ref_url: str | None = None
    clc_code: str | None = None
    ddc_code: str | None = None

    @field_validator("description", "cover_url", mode="before")
    @classmethod
    def empty_string_to_none(cls, v):
        if isinstance(v, str) and not v.strip():
            return None
        return v

    @field_validator("rating")
    @classmethod
    def round_rating(cls, v: float | None) -> float | None:
        if v is not None:
            return round(v, 1)
        return v


class BookCreate(BookBase):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    tenant_id: uuid.UUID | None = None
    uuid: str = Field(min_length=32, max_length=64)
    path: str | None = ""
    file_url: str | None = ""
    extension: str | None = ""
    size: int | None = 0


class BookUpdate(BookBase):
    id: uuid.UUID
    title: str | None = ""


class BookPublic(BookCreate, BaseMixin):
    workspace_id: uuid.UUID
    user_id: uuid.UUID
    workspace_book_id: uuid.UUID | None = None


class BookDetails(BaseApiModel, BaseMixin):
    # book
    title: str
    file_url: str | None = None
    cover_url: str | None = None
    author: str | None = None
    language: str | None = None
    description: str | None = None
    publisher: str | None = None
    published: str | None = None
    rating: float | None = 0.0
    extension: str | None = None
    media: list | None = None
    isbn: str | None = None
    ref_url: str | None = None
    scope: int

    # user_book
    user_book_id: uuid.UUID | None = None
    reading_position: str | None = ""
    reading_percentage: float | None = 0.0
    reading_status: int | None = None
    user_rating: float | None = 0.0
    is_physical: int | None = None
    location: str | None = None
