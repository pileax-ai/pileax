import uuid

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field


class WorkspaceBook(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "workspace_book"

    __table_args__ = (UniqueConstraint("workspace_id", "book_id", "user_id", name="unique_workspace_user_book"),)

    workspace_id: uuid.UUID = uuid_field()
    book_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()


class WorkspaceBookBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID | None = None
    book_id: uuid.UUID | None = None
    workspace_id: uuid.UUID | None = None


class WorkspaceBookCreate(WorkspaceBookBase):
    pass


class WorkspaceBookUpdate(WorkspaceBookBase):
    id: uuid.UUID


class WorkspaceBookUpdateReadingProgress(BaseApiModel):
    id: uuid.UUID


class WorkspaceBookPublic(WorkspaceBookCreate, BaseMixin):
    pass


class WorkspaceBookDetails(WorkspaceBookPublic):
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
    user_book_id: uuid.UUID | None = None
    rating: int | None = 0
    reading_position: str | None = ""
    reading_percentage: float | None = 0.0
    reading_status: int | None = None


class WorkspaceCollectionBookDetails(WorkspaceBookDetails):
    tid: uuid.UUID | None = None
