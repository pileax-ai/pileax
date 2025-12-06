import enum
import uuid

from sqlmodel import Field, Column, String, Integer

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field
from app.api.models.enums import Status


class WorkspaceType(enum.StrEnum):
    PERSONAL = "personal"
    TEAM = "team"


class Workspace(BaseSQLModel, BaseMixin, table=True):
    tenant_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    name: str = Field(..., max_length=100)
    icon: str | None = Field(default=None)
    type: str = Field(
        default=WorkspaceType.PERSONAL,
        max_length=32,
        sa_column=Column(String(32), default=WorkspaceType.PERSONAL)
    )
    status: int = Field(
        default=Status.ACTIVE,
        sa_type=Integer,
        sa_column_kwargs={"default": Status.ACTIVE}
    )


class WorkspaceBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    name: str | None = None
    icon: str | None = None


class WorkspaceCreate(BaseApiModel):
    name: str
    icon: str | None = None
    type: str


class WorkspaceUpdate(WorkspaceBase):
    id: uuid.UUID


class WorkspacePublic(WorkspaceCreate, BaseMixin):
    pass
