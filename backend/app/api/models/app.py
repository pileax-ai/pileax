import uuid

from pydantic import field_validator
from sqlmodel import Column, Field, Integer

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field
from app.api.models.enums import Status


class App(BaseSQLModel, BaseMixin, table=True):
    user_id: uuid.UUID = uuid_field()
    tenant_id: uuid.UUID = uuid_field()
    app_model_config_id: uuid.UUID = uuid_field(default_none=True)
    name: str = Field(..., max_length=255)
    mode: str = Field(..., max_length=255)
    description: str | None = Field(default=None, description="Note content")
    icon: str | None = Field(default=None)
    status: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))


class AppBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    parent: uuid.UUID | None = None
    icon: str | None = None

    @field_validator("parent", mode="before")
    def parse_empty_string_as_none(cls, v):
        if v == "":
            return None
        return v


class AppCreate(AppBase):
    title: str | None = None
    content: str | None = None


class AppUpdate(AppBase):
    id: uuid.UUID
    title: str | None = None
    content: str | None = None


class AppPublic(AppCreate, BaseMixin):
    pass
