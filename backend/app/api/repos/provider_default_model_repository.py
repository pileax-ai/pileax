from uuid import UUID

from sqlalchemy import TextClause, text

from app.api.models.provider_default_model import ProviderDefaultModel, ProviderDefaultModelCredential
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class ProviderDefaultModelRepository(BaseRepository[ProviderDefaultModel]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_default_model_credential(
        self, workspace_id: UUID, model_type: str
    ) -> ProviderDefaultModelCredential | None:
        sql: TextClause = text("""
            select pdm.id, pdm.provider, pdm.model_type, pdm.model_name, pc.credential
            from provider_default_model pdm
            left join provider p ON p.provider = pdm.provider and p.workspace_id = pdm.workspace_id
            left join provider_credential pc on pc.id = p.credential_id
            where pdm.model_type = :model_type and pdm.workspace_id = :workspace_id
        """)

        with self.session as session:
            conn = session.connection()
            result = conn.execute(sql, {"workspace_id": str(workspace_id), "model_type": model_type})
            row = result.mappings().first()

        if row is None:
            return None
        else:
            data = DbHelper.parse_json_fields(dict(row), ["credential"])
            return ProviderDefaultModelCredential(**data)
