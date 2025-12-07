import enum
import uuid

from sqlalchemy import Integer, String, text
from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field


class WorkspaceApp(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "workspace_app"

    __table_args__ = (
        UniqueConstraint("workspace_id", "app_id", name="unique_workspace_app"),
    )

    workspace_id: uuid.UUID = uuid_field()
    app_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()


class WorkspaceAppBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID | None = None
    app_id: uuid.UUID | None = None
    workspace_id: uuid.UUID | None = None


class WorkspaceAppCreate(WorkspaceAppBase):
    pass


class WorkspaceAppUpdate(WorkspaceAppBase):
    id: uuid.UUID

class WorkspaceAppUpdateReadingProgress(BaseApiModel):
    id: uuid.UUID


class WorkspaceAppPublic(WorkspaceAppCreate, BaseMixin):
    pass
