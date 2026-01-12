import uuid

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field


class WorkspaceBookCollection(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "workspace_book_collection"

    __table_args__ = (
        UniqueConstraint("workspace_book_id", "book_collection_id", name="unique_workspace_book_collection"),
    )

    workspace_id: uuid.UUID = uuid_field()
    book_collection_id: uuid.UUID = uuid_field()
    workspace_book_id: uuid.UUID = uuid_field()


class WorkspaceBookCollectionBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    workspace_book_id: uuid.UUID
    book_collection_id: uuid.UUID
    workspace_id: uuid.UUID | None = None


class WorkspaceBookCollectionCreate(WorkspaceBookCollectionBase):
    pass


class WorkspaceBookCollectionUpdate(WorkspaceBookCollectionBase):
    id: uuid.UUID


class WorkspaceBookCollectionPublic(WorkspaceBookCollectionCreate, BaseMixin):
    pass


class WorkspaceBookCollectionDetails(WorkspaceBookCollectionPublic):
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
