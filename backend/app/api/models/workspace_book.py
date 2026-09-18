import uuid

import sqlalchemy as sa
from sqlmodel import Field, UniqueConstraint, text

from app.api.models.base import GUID, BaseApiModel, BaseMixin, BaseSQLModel, uuid_field
from app.api.models.book import GroupBook
from app.api.models.book_collection import BookCollectionPublic
from app.constants import UUID_NIL


class WorkspaceBook(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "workspace_book"

    __table_args__ = (UniqueConstraint("workspace_id", "book_id", "user_id", name="unique_workspace_user_book"),)

    workspace_id: uuid.UUID = uuid_field()
    book_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    book_group_id: uuid.UUID | None = Field(
        default=UUID_NIL,
        sa_column=sa.Column(GUID(), server_default=text(f"'{UUID_NIL}'"), nullable=True),
    )


class WorkspaceBookBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID | None = None
    book_id: uuid.UUID | None = None
    workspace_id: uuid.UUID | None = None
    book_group_id: uuid.UUID | None = Field(default=UUID_NIL)


class WorkspaceBookCreate(WorkspaceBookBase):
    pass


class WorkspaceBookUpdate(WorkspaceBookBase):
    id: uuid.UUID


class WorkspaceBookUpdateReadingProgress(BaseApiModel):
    id: uuid.UUID


class WorkspaceBookPublic(WorkspaceBookCreate, BaseMixin):
    pass


class WorkspaceBookDetails(WorkspaceBookPublic):
    book_user_id: uuid.UUID
    book_workspace_id: uuid.UUID

    # book
    title: str
    subtitle: str | None = None
    path: str | None = None
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
    user_rating: float | None = 0.0
    reading_position: str | None = ""
    reading_percentage: float | None = 0.0
    reading_status: int | None = None
    is_physical: int | None = None
    location: str | None = None


class WorkspaceCollectionBookDetails(WorkspaceBookDetails):
    tid: uuid.UUID | None = None


class WorkspaceBookGroup(BaseApiModel):
    id: uuid.UUID
    count: int
    collection: BookCollectionPublic
    books: list[GroupBook]
