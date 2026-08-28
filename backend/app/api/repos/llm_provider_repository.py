from typing import Any

from sqlalchemy import TextClause, select, text

from app.api.models.enums import Status
from app.api.models.llm import LLM
from app.api.models.llm_provider import LLMProvider
from app.api.repos.base_repository import BaseRepository


class LLMProviderRepository(BaseRepository[LLMProvider]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def find_provider_models(self) -> Any:
        stmt = (
            select(LLMProvider, LLM)
            .outerjoin(LLM, LLMProvider.name == LLM.provider)
            .where(LLMProvider.status == Status.ACTIVE)
        )

        results = self.session.exec(stmt).all()

        # Dictionary to group models by provider name
        provider_map = {}

        for provider, llm in results:
            if provider.name not in provider_map:
                provider_map[provider.name] = {**provider.model_dump(), "models": []}

            # If the provider has a linked model, append it to the list
            if llm is not None and llm.status == Status.ACTIVE:
                provider_map[provider.name]["models"].append(llm)

        # Convert the map values to a list
        return list(provider_map.values())

    def find_all_with_count(self) -> Any:
        sql_template = """
            SELECT
                p.*,
                COUNT(l.provider) AS model_count
            FROM
                llm_provider p
            LEFT JOIN
                llm l ON p.name = l.provider AND l.status = :status
            WHERE
                p.status = :status
            GROUP BY
                p.id;
        """
        params = {
            "status": Status.ACTIVE,
        }

        sql: TextClause = text(sql_template)

        with self.session as session:
            conn = session.connection()
            result = conn.execute(sql, params)
            rows = result.mappings().all()

        return rows
