from typing import Any
from uuid import UUID

from sqlalchemy import text, TextClause

from app.api.models.tenant_default_model import TenantDefaultModel, TenantDefaultModelCredential
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class TenantDefaultModelRepository(BaseRepository[TenantDefaultModel]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_default_model_credential(self, tenant_id: UUID, model_type: str) -> TenantDefaultModelCredential | None:
        sql: TextClause = text("""
            select tdm.id, tdm.provider, tdm.model_type, tdm.model_name, pc.credential
            from tenant_default_model tdm
            left join provider p ON p.provider = tdm.provider and p.tenant_id = tdm.tenant_id
            left join provider_credential pc on pc.id = p.credential_id
            where tdm.model_type = :model_type and tdm.tenant_id = :tenant_id
        """)

        with self.session as session:
            conn = session.connection()
            result = conn.execute(sql, {
                "tenant_id": str(tenant_id),
                "model_type": model_type
            })
            row = result.mappings().first()

        if row is None:
            return None
        else:
            data = DbHelper.parse_json_fields(dict(row), ['credential'])
            return TenantDefaultModelCredential(**data)
