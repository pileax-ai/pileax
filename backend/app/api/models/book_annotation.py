import enum
import uuid

from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, JSONString, uuid_field


class BookAnnotationType(enum.StrEnum):
    BOOKMARK = "bookmark"
    HIGHLIGHT = "highlight"
    NOTE = "note"


class BookAnnotation(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "book_annotation"

    tenant_id: uuid.UUID = uuid_field()
    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    book_id: uuid.UUID = uuid_field()
    title: str | None = Field(default=None)
    type: str | None = Field(default=None)
    value: str | None = Field(default=None)
    note: str | None = Field(default=None)
    note_json: dict | None = Field(default=None, sa_type=JSONString, description="Note JSON content")
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


class BookAnnotationUpdate(BookAnnotationBase):
    id: uuid.UUID


class BookAnnotationPublic(BookAnnotationCreate, BaseMixin):
    pass


class BookAnnotationDetails(BookAnnotationPublic):
    book_title: str
    file_url: str | None = None
    cover_url: str | None = None
