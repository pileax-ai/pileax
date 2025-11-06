import enum
import uuid

from sqlmodel import Field, Column, String, Integer

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin
from app.api.models.enums import Status


class TenantPlan(enum.StrEnum):
    BASIC = "basic"
    PLUS = "plus"
    PREMIUM = "premium"


class TenantType(enum.StrEnum):
    PERSONAL = "personal"
    TEAM = "team"


class Tenant(BaseSQLModel, BaseMixin, table=True):
    name: str = Field(..., max_length=100)
    plan: str = Field(
        default=TenantPlan.BASIC,
        max_length=32,
        sa_column=Column(String(32), default=TenantPlan.BASIC)
    )
    type: str = Field(
        default=TenantType.PERSONAL,
        max_length=32,
        sa_column=Column(String(32), default=TenantType.PERSONAL)
    )
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


class UserPublic(UserCreate, BaseMixin):
    pass
