import uuid

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field


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


class TenantBookBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID | None = None
    book_id: uuid.UUID | None = None
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
