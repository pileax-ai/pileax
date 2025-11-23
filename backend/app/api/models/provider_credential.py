import uuid

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field, JSONString


class ProviderCredential(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "provider_credential"

    __table_args__ = (
        UniqueConstraint("tenant_id", "provider", "name", name="unique_tenant_provider_name"),
    )

    tenant_id: uuid.UUID = uuid_field()
    provider: str | None = Field(default=None)
    name: str = Field(..., max_length=255)
    credential: dict = Field(..., sa_type=JSONString)


class Credential(BaseApiModel):
    api_key: str
    base_url: str | None = None


class ProviderCredentialBase(BaseApiModel):
    id: uuid.UUID | None = None
    provider: str
    name: str
    credential: Credential


class ProviderCredentialCreate(ProviderCredentialBase):
    pass


class ProviderCredentialUpdate(ProviderCredentialBase):
    id: uuid.UUID
    name: str | None = ""
    credential: Credential


class ProviderCredentialPublic(ProviderCredentialBase):
    pass
