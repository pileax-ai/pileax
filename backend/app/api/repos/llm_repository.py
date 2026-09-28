from sqlalchemy import delete
from sqlmodel import select

from app.api.models.enums import Status, UserType
from app.api.models.llm import LLM
from app.api.models.llm_provider import LLMProvider
from app.api.repos.base_repository import BaseRepository


class LLMRepository(BaseRepository[LLM]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def find_all_by_providers(self, providers: list[str]):
        stmt = (
            select(LLM, LLMProvider)
            .join(LLMProvider, LLMProvider.name == LLM.provider)
            .where(
                LLM.provider.in_(providers),
                LLM.status == Status.ACTIVE,
            )
        )
        results = self.session.exec(stmt).all()

        item_map = {}
        for llm, provider in results:
            if llm.id not in item_map:
                item_map[llm.id] = {**llm.model_dump(), "logo": provider.logo}

        return list(item_map.values())

    def clean_deprecated_model(self, version: str) -> int:
        stmt = delete(LLM).where(
            LLM.version != version,
            LLM.creator_type == UserType.SYSTEM
        )
        result = self.session.exec(stmt)
        self.session.commit()

        return getattr(result, "rowcount", 0) or 0
