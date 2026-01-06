import uuid

from sqlalchemy import Integer, UniqueConstraint, event, text
from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field
from app.api.models.enums import Scope
from app.libs.db_helper import DbHelper


class Book(BaseSQLModel, BaseMixin, table=True):
    __table_args__ = (UniqueConstraint("tenant_id", "uuid", name="unique_tenant_book"),)

    tenant_id: uuid.UUID = uuid_field()
    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    uuid: str = Field(..., min_length=32, max_length=64, description="Book sha1 hash")
    title: str = Field(..., max_length=255, description="Book title")
    title_pinyin: str | None = Field(default=None)
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
    scope: int | None = Field(
        default=Scope.WORKSPACE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Scope.WORKSPACE))}
    )


@event.listens_for(Book, "before_insert")
def before_insert(mapper, connection, target: Book):
    target.title_pinyin = DbHelper.to_pinyin(target.title)


@event.listens_for(Book, "before_update")
def before_update(mapper, connection, target: Book):
    target.title_pinyin = DbHelper.to_pinyin(target.title)


class BookBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    title: str
    author: str | None = None
    language: str | None = None
    description: str | None = None
    publisher: str | None = None
    published: str | None = None


class BookCreate(BookBase):
    tenant_id: uuid.UUID | None = None
    uuid: str = Field(min_length=32, max_length=64)
    path: str
    file_name: str
    cover_name: str | None = ""
    extension: str | None = ""


class BookUpdate(BookBase):
    id: uuid.UUID
    title: str | None = ""


class BookPublic(BookCreate, BaseMixin):
    tenant_id: uuid.UUID
    pass


class BookDetails(BaseApiModel, BaseMixin):
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
    rating: int
    user_book_id: uuid.UUID | None = None
    rating: int | None = 0
    reading_position: str | None = ""
    reading_percentage: float | None = 0.0
    reading_status: int | None = None
