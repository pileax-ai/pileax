import uuid

from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field


class BookAnnotation(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "book_annotation"

    tenant_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    book_id: uuid.UUID = uuid_field()
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


class BookAnnotationUpdate(BookAnnotationBase):
    id: uuid.UUID


class BookAnnotationPublic(BookAnnotationCreate, BaseMixin):
    pass


class BookAnnotationDetails(BookAnnotationPublic):
    book_title: str
    path: str | None = None
    file_name: str | None = None
    cover_name: str | None = None
