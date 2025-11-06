import enum
import uuid

from sqlmodel import Column, Field, Integer

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field
from app.api.models.enums import Status


class TenantMember(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "tenant_member"

    tenant_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    role: str = Field(..., max_length=32)
    invited_by: uuid.UUID | None = uuid_field(default_none=True)
    status: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))


class TenantMemberBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    role: str | None = None


class TenantMemberCreate(BaseApiModel):
    tenant_id: str
    user_id: str
    role: str
    invited_by: str


class TenantMemberUpdate(TenantMemberBase):
    id: uuid.UUID


class TenantMemberPublic(TenantMemberCreate, BaseMixin):
    pass


class TenantMemberPublicDetails(TenantMemberPublic):
    user_name: str
    user_email: str
    last_active_time: str | None = None


class TenantMemberRole(enum.StrEnum):
    OWNER = "owner"
    ADMIN = "admin"
    EDITOR = "editor"
    NORMAL = "normal"
    DATASET_OPERATOR = "dataset_operator"
