from app.api.models.tenant import Tenant
from app.api.repos.base_repository import BaseRepository


class TenantRepository(BaseRepository[Tenant]):
    def __init__(self, model, session):
        super().__init__(model, session)
