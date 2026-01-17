from abc import ABC, abstractmethod
from typing import Any, Optional

from app.api.models.database_cache import DatabaseCache
from app.api.repos.database_cache_repository import DatabaseCacheRepository
from app.extensions.ext_database import get_db_session


class Cache(ABC):
    def __init__(self):
        self.session = next(get_db_session())
        self.repo = DatabaseCacheRepository(DatabaseCache, self.session)

    @abstractmethod
    def get(self, key: str) -> Optional[Any]:
        ...

    @abstractmethod
    def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        persist: Optional[bool] = False,
    ) -> None:
        ...

    @abstractmethod
    def delete(self, key: str) -> None:
        ...

    @abstractmethod
    def clear(self) -> None:
        ...

    @abstractmethod
    def test_connection(self) -> bool:
        ...

    def persist(self, key: str, value: Any) -> None:
        self.repo.create(DatabaseCache(
            key=key,
            value=value,
        ))

    def load(self) -> int:
        self.repo.delete_older_than(30)
        list = self.repo.find_all()
        for item in list:
            self.set(item.key, item.value)

        return len(list)
