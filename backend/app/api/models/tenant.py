import enum
import uuid

from sqlalchemy import Column, String, Integer
from sqlmodel import Field

from app.api.models.common import BaseApiModel, BaseSQLModel, UUIDString, TimestampMixin, Status


class Tenant(BaseSQLModel, TimestampMixin, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), primary_key=True)
    )
    name: str = Field(..., max_length=100)
    plan: str = Field(default="basic", max_length=32, sa_column=Column(String(32), default="basic"))
    public_key: str | None = Field(default=None, max_length=255)
    status: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))


class TenantBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    name: str | None = None
    plan: str | None = None


class UserCreate(BaseApiModel):
    name: str
    plan: str


class UserUpdate(TenantBase):
    id: uuid.UUID


class UserPublic(UserCreate, TimestampMixin):
    pass


class TenantPlan(enum.StrEnum):
    BASIC = "basic"
    TEAM = "team"
