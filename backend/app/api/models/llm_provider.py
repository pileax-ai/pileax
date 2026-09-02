import uuid

from sqlalchemy import Integer, text
from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, JSONString
from app.api.models.enums import Status
from app.api.models.llm import LLMPublic


class LLMProvider(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "llm_provider"
    __table_args__ = (UniqueConstraint("name", name="unique_llm_provider_name"),)

    name: str = Field(...)
    label: str = Field(...)
    version: str = Field(...)
    logo: str | None = Field(default=None)
    tags: str | None = Field(default=None)
    apikey_url: str | None = Field(default=None)
    status: int = Field(
        default=Status.ACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.ACTIVE))}
    )
    extra: dict | None = Field(default=None, sa_type=JSONString)


class LLMProviderBase(BaseApiModel):
    id: uuid.UUID | None = None
    label: str | None = None
    logo: str | None = None
    tags: str | None = None
    apikey_url: str | None = None
    status: int | None = None
    extra: dict | None = None


class LLMProviderCreate(LLMProviderBase):
    name: str
    label: str
    version: str


class LLMProviderUpdate(LLMProviderBase):
    id: uuid.UUID


class LLMProviderPublic(LLMProviderBase):
    name: str
    version: str


class LLMProviderPublicCount(LLMProviderPublic):
    model_count: int


class LLMProviderModels(LLMProviderPublic):
    models: list[LLMPublic]
