import enum
import uuid

from sqlalchemy import Index
from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, JSONString, uuid_field


class BookAnnotationType(enum.StrEnum):
    ANNOTATION = "annotation"
    BOOKMARK = "bookmark"
    NOTE = "note"


class BookAnnotationStyle(enum.StrEnum):
    HIGHLIGHT = "highlight"
    UNDERLINE = "underline"
    STRIKETHROUGH = "strikethrough"
    SQUIGGLY = "squiggly"
    OUTLINE = "outline"


class BookAnnotation(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "book_annotation"
    __table_args__ = (Index("idx_book_annotation_user_id_book_id", "user_id", "book_id"),)

    tenant_id: uuid.UUID = uuid_field()
    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    book_id: uuid.UUID = uuid_field()
    value: str | None = Field(default=None)
    chapter: str | None = Field(default=None)
    page: int | None = Field(default=0, ge=0)
    type: str | None = Field(default=None)
    style: str | None = Field(default=None)
    color: str | None = Field(default=None)
    title: str | None = Field(default=None)
    note: str | None = Field(default=None)
    note_json: dict | None = Field(default=None, sa_type=JSONString, description="Note JSON content")


class BookAnnotationBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    type: str | None = None
    style: str | None = None
    value: str | None = None
    title: str | None = None
    note: str | None = None
    note_json: dict | None = None
    color: str | None = None
    chapter: str | None = None
    page: int | None = None


class BookAnnotationCreate(BookAnnotationBase):
    book_id: uuid.UUID | None = None


class BookAnnotationUpdate(BookAnnotationBase):
    id: uuid.UUID


class BookAnnotationPublic(BookAnnotationCreate, BaseMixin):
    pass


class BookAnnotationDetails(BookAnnotationPublic):
    book_title: str
    file_url: str | None = None
    cover_url: str | None = None


class BookAnnotationGroup(BaseApiModel):
    cover_url: str | None = None
    title: str | None = None
    book_id: uuid.UUID
    count: int
