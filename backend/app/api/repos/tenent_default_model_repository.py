from app.api.models.tenant_default_model import TenantDefaultModel
from app.api.repos.base_repository import BaseRepository


class TenantDefaultModelRepository(BaseRepository[TenantDefaultModel]):
    def __init__(self, model, session):
        super().__init__(model, session)
