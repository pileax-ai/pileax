import enum
import uuid

from sqlalchemy import UniqueConstraint
from sqlmodel import Column, Field, Integer

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field
from app.api.models.enums import Status


class WorkspaceMemberRole(enum.StrEnum):
    OWNER = "owner"
    ADMIN = "admin"
    EDITOR = "editor"
    NORMAL = "normal"


class WorkspaceMember(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "workspace_member"
    __table_args__ = (UniqueConstraint("workspace_id", "user_id", name="unique_workspace_member"),)

    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    role: str = Field(..., max_length=32)
    invited_by: uuid.UUID | None = uuid_field(default_none=True)
    status: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))


class WorkspaceMemberBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    role: str | None = None


class WorkspaceMemberCreate(BaseApiModel):
    user_id: uuid.UUID
    role: str
    invited_by: uuid.UUID


class WorkspaceMemberInvite(BaseApiModel):
    email: str
    role: str


class WorkspaceMemberUpdate(WorkspaceMemberBase):
    id: uuid.UUID


class WorkspaceMemberPublic(WorkspaceMemberCreate, BaseMixin):
    status: int


class WorkspaceMemberPublicDetails(WorkspaceMemberPublic):
    user_name: str
    user_email: str
    last_active_time: str | None = None
