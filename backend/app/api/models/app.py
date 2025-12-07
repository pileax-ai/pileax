import uuid

from sqlmodel import Field, Integer, text

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field
from app.api.models.enums import Status, Scope


class App(BaseSQLModel, BaseMixin, table=True):
    tenant_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    app_model_config_id: uuid.UUID | None = uuid_field(default_none=True)
    name: str = Field(..., max_length=255)
    mode: str = Field(..., max_length=255)
    description: str | None = Field(default=None, description="Note content")
    icon: str | None = Field(default=None)
    status: int = Field(
        default=Status.ACTIVE,
        sa_type=Integer,
        sa_column_kwargs={"server_default": text(str(Status.ACTIVE))}
    )
    scope: int | None = Field(
        default=Scope.WORKSPACE,
        sa_type=Integer,
        sa_column_kwargs={"server_default": text(str(Scope.WORKSPACE))})


class AppBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    name: str | None = None
    icon: str | None = None
    mode: str | None = None


class AppCreate(AppBase):
    title: str | None = None
    content: str | None = None


class AppUpdate(AppBase):
    id: uuid.UUID
    title: str | None = None
    content: str | None = None


class AppPublic(AppCreate, BaseMixin):
    pass
