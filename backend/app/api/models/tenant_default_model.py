import uuid

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseSQLModel, BaseMixin, uuid_field, BaseApiModel


class TenantDefaultModel(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "tenant_default_model"
    __table_args__ = (
        UniqueConstraint("tenant_id", "model_type", name="unique_tenant_model_type"),
    )

    tenant_id: uuid.UUID = uuid_field()
    provider: str = Field(...)
    model_name: str = Field(...)
    model_type: str = Field(...)


class TenantDefaultModelBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    provider: str
    model_name: str
    model_type: str


class TenantDefaultModelCreate(TenantDefaultModelBase):
    pass


class TenantDefaultModelUpdate(TenantDefaultModelBase):
    id: uuid.UUID


class TenantDefaultModelPublic(TenantDefaultModelBase, BaseMixin):
    pass
