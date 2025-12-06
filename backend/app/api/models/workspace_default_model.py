import uuid

from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseSQLModel, BaseMixin, uuid_field, BaseApiModel
from app.api.models.provider_credential import Credential


class WorkspaceDefaultModel(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "workspace_default_model"
    __table_args__ = (
        UniqueConstraint("workspace_id", "model_type", name="unique_workspace_model_type"),
    )

    workspace_id: uuid.UUID = uuid_field()
    provider: str = Field(...)
    model_name: str = Field(...)
    model_type: str = Field(...)


class WorkspaceDefaultModelBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    provider: str
    model_name: str
    model_type: str


class WorkspaceDefaultModelCreate(WorkspaceDefaultModelBase):
    pass


class WorkspaceDefaultModelUpdate(WorkspaceDefaultModelBase):
    id: uuid.UUID


class WorkspaceDefaultModelPublic(WorkspaceDefaultModelBase, BaseMixin):
    pass


class WorkspaceDefaultModelCredential(WorkspaceDefaultModelBase):
    credential: Credential | None
