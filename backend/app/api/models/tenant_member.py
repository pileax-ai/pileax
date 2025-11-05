import enum
import uuid

from sqlalchemy import Column, Integer
from sqlmodel import Field

from app.api.models.common import BaseApiModel, BaseSQLModel, UUIDString, TimestampMixin, Status


class TenantMember(BaseSQLModel, TimestampMixin, table=True):
    __tablename__ = "tenant_member"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), primary_key=True)
    )
    tenant_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), nullable=False)
    )
    user_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), nullable=False)
    )
    role: str = Field(..., max_length=32)
    invited_by: uuid.UUID | None = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), nullable=False)
    )
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


class TenantMemberPublic(TenantMemberCreate, TimestampMixin):
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
