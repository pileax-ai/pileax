import uuid

from sqlalchemy import Integer, text
from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, JSONString
from app.api.models.enums import Status


class LLM(BaseSQLModel, BaseMixin, table=True):
    __table_args__ = (UniqueConstraint("provider", "model_name", name="unique_llm_provider_model_name"),)

    provider: str = Field(...)
    model_name: str = Field(...)
    model_type: str = Field(...)
    model_alias: str | None = Field(default=None)
    tags: str | None = Field(default=None)
    max_tokens: int | None = Field(default=None)
    is_tools: int = Field(
        default=Status.ACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.INACTIVE))}
    )
    status: int = Field(
        default=Status.ACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.ACTIVE))}
    )
    extra: dict | None = Field(default=None, sa_type=JSONString)


class LLMBase(BaseApiModel):
    id: uuid.UUID | None = None
    model_name: str | None = None
    model_type: str | None = None
    model_alias: str | None = None
    tags: str | None = None
    max_tokens: int | None = None
    is_tools: int | None = None
    status: int | None = None
    extra: dict | None = None


class LLMCreate(LLMBase):
    provider: str
    model_name: str
    model_type: str


class LLMUpdate(LLMBase):
    id: uuid.UUID


class LLMPublic(LLMBase, BaseMixin):
    provider: str
