import uuid

from pydantic import BaseModel

from app.api.models.workspace import WorkspaceDetails


class Owner(BaseModel):
    tenant_id: uuid.UUID | None = None
    user_id: uuid.UUID | None = None
    workspace_id: uuid.UUID | None = None
    workspace: WorkspaceDetails | None = None
