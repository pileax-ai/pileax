import uuid

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseSQLModel, BaseMixin, uuid_field, BaseApiModel
from app.api.models.provider_credential import Credential


class ProviderDefaultModel(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "provider_default_model"
    __table_args__ = (
        UniqueConstraint("workspace_id", "model_type", name="unique_workspace_provider_model_type"),
    )

    workspace_id: uuid.UUID = uuid_field()
    provider: str = Field(...)
    model_name: str = Field(...)
    model_type: str = Field(...)


class ProviderDefaultModelBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    provider: str
    model_name: str
    model_type: str


class ProviderDefaultModelCreate(ProviderDefaultModelBase):
    pass


class ProviderDefaultModelUpdate(ProviderDefaultModelBase):
    id: uuid.UUID


class ProviderDefaultModelPublic(ProviderDefaultModelBase, BaseMixin):
    pass


class ProviderDefaultModelCredential(ProviderDefaultModelBase):
    credential: Credential | None
