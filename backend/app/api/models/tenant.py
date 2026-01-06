import enum
import uuid

from sqlmodel import Column, Field, Integer, String

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field
from app.api.models.enums import Status


class TenantPlan(enum.StrEnum):
    BASIC = "basic"
    TEAM = "team"
    ENTERPRISE = "enterprise"


class TenantType(enum.StrEnum):
    PERSONAL = "personal"
    ORGANIZATION = "organization"


class Tenant(BaseSQLModel, BaseMixin, table=True):
    user_id: uuid.UUID = uuid_field()
    name: str = Field(..., max_length=100)
    icon: str | None = Field(default=None)
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
    status: int = Field(
        default=Status.ACTIVE,
        sa_type=Integer,
        sa_column_kwargs={"default": Status.ACTIVE}
    )


class TenantBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    name: str | None = None
    icon: str | None = None
    plan: str | None = None


class TenantCreate(BaseApiModel):
    name: str
    icon: str | None = None
    plan: str
    type: str


class TenantUpdate(TenantBase):
    id: uuid.UUID


class TenantPublic(TenantCreate, BaseMixin):
    pass
