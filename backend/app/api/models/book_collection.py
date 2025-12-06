import uuid

from pydantic import field_validator
from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field


class BookCollection(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "book_collection"

    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    parent: uuid.UUID | None = uuid_field(default_none=True)
    title: str = Field(..., max_length=255, description="BookCollection title")
    icon: str | None = Field(default=None)
    cover: str | None = Field(default=None)
    color: str | None = Field(default=None)
    position: int | None = Field(default=0)


class BookCollectionBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    parent: uuid.UUID | None = None
    title: str | None = None
    icon: str | None = None
    cover: str | None = None
    color: str | None = None

    @field_validator("parent", mode="before")
    def parse_empty_string_as_none(cls, v):
        if v == "":
            return None
        return v


class BookCollectionCreate(BookCollectionBase):
    title: str


class BookCollectionUpdate(BookCollectionBase):
    id: uuid.UUID


class BookCollectionPublic(BookCollectionCreate, BaseMixin):
    workspace_id: uuid.UUID
    pass
