import uuid

from pydantic import BaseModel

class Owner(BaseModel):
    tenant_id: uuid.UUID | None = None
    workspace_id: uuid.UUID | None = None
    user_id: uuid.UUID | None = None

