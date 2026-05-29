import uuid

from sqlalchemy import UniqueConstraint
from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field


class Tag(BaseSQLModel, BaseMixin, table=True):
    __table_args__ = (UniqueConstraint("user_id", "type", "name", name="unique_user_tag"),)

    tenant_id: uuid.UUID = uuid_field()
    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    name: str = Field(..., max_length=255)
    type: str = Field(..., max_length=64, description="note, book")
    icon: str | None = Field(default=None)
    color: str | None = Field(default=None)


class TagBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    type: str | None = None
    name: str | None = None
    icon: str | None = None
    color: str | None = None


class TagCreate(TagBase):
    type: str
    name: str


class TagUpdate(TagBase):
    id: uuid.UUID


class TagPublic(TagCreate, BaseMixin):
    pass
