import uuid

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field


class TenantBookCollection(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "tenant_book_collection"

    __table_args__ = (
        UniqueConstraint("tenant_book_id", "book_collection_id", name="unique_tenant_book_collection"),
    )

    tenant_id: uuid.UUID = uuid_field()
    book_collection_id: uuid.UUID = uuid_field()
    tenant_book_id: uuid.UUID = uuid_field()


class TenantBookCollectionBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    tenant_book_id: uuid.UUID
    book_collection_id: uuid.UUID
    tenant_id: uuid.UUID | None = None


class TenantBookCollectionCreate(TenantBookCollectionBase):
    pass


class TenantBookCollectionUpdate(TenantBookCollectionBase):
    id: uuid.UUID


class TenantBookCollectionPublic(TenantBookCollectionCreate, BaseMixin):
    pass

class TenantBookCollectionDetails(TenantBookCollectionPublic):
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
