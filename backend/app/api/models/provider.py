import uuid
from typing import List

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field


class Provider(BaseSQLModel, BaseMixin, table=True):
    __table_args__ = (UniqueConstraint("workspace_id", "provider", name="unique_workspace_provider"),)

    workspace_id: uuid.UUID = uuid_field()
    provider: str = Field(...)
    credential_id: uuid.UUID | None = uuid_field(default_none=True)


class ProviderBase(BaseApiModel):
    provider: str | None = None
    credential_id: uuid.UUID | None = None


class ProviderCreate(ProviderBase):
    id: uuid.UUID


class ProviderUpdate(ProviderBase):
    id: uuid.UUID


class ProviderPublic(ProviderBase, BaseMixin):
    pass


class ProviderCredential(BaseApiModel):
    id: uuid.UUID | None
    provider: str
    name: str


class ProviderAllPublic(ProviderBase, BaseMixin):
    credentials: List[ProviderCredential] | None


class LLMInfo(BaseApiModel):
    model_name: str
    model_type: str
    tags: str | None = None
    max_tokens: int | None = None


class LLMInfoDetails(LLMInfo):
    provider: str | None = ""
    logo: str | None = ""


class ProviderInfo(BaseApiModel):
    name: str
    logo: str | None = ""
    tags: str | None = ""
    apikey_url: str | None = ""
    models: list[LLMInfo] | None


class LLMConfigInfo(BaseApiModel):
    version: str
    description: str | None = ""
    modified: str | None = ""
    providers: list[ProviderInfo] | None
