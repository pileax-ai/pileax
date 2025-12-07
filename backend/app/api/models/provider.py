import uuid
from typing import List

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseSQLModel, BaseMixin, uuid_field, BaseApiModel


class Provider(BaseSQLModel, BaseMixin, table=True):
    __table_args__ = (
        UniqueConstraint("workspace_id", "provider", name="unique_workspace_provider"),
    )

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
