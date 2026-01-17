from datetime import datetime, timedelta

from sqlalchemy import delete

from app.api.models.database_cache import DatabaseCache
from app.api.repos.base_repository import BaseRepository


class DatabaseCacheRepository(BaseRepository[DatabaseCache]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def delete_older_than(self, days: int) -> int:
        """
        Deletes older entries older than `days`
        """
        threshold = datetime.utcnow() - timedelta(days=days)
        stmt = delete(self.model).where(self.model.create_time < threshold)
        result = self.session.exec(stmt)
        self.session.commit()

        return getattr(result, "rowcount", 0) or 0
