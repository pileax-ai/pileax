import uuid

from sqlalchemy import Integer, text
from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, JSONString, uuid_field
from app.api.models.enums import Status


class WorkspaceLLM(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "workspace_llm"
    __table_args__ = (
        UniqueConstraint("workspace_id", "provider", "model_name", name="unique_workspace_llm_provider_model_name"),
    )
    workspace_id: uuid.UUID = uuid_field()

    provider: str = Field(...)
    model_name: str = Field(...)
    model_type: str = Field(...)
    model_alias: str | None = Field(default=None)
    tags: str | None = Field(default=None)
    max_tokens: int | None = Field(default=None)
    is_tools: int = Field(
        default=Status.INACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.INACTIVE))}
    )
    status: int = Field(
        default=Status.ACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.ACTIVE))}
    )
    extra: dict | None = Field(default=None, sa_type=JSONString)


class WorkspaceLLMBase(BaseApiModel):
    id: uuid.UUID | None = None
    model_name: str | None = None
    model_type: str | None = None
    model_alias: str | None = None
    tags: str | None
    max_tokens: int | None = None
    is_tools: int | None = None
    status: int | None = None
    extra: dict | None = None


class WorkspaceLLMCreate(WorkspaceLLMBase):
    provider: str
    model_name: str
    model_type: str


class WorkspaceLLMUpdate(WorkspaceLLMBase):
    id: uuid.UUID


class WorkspaceLLMPublic(WorkspaceLLMBase, BaseMixin):
    provider: str
