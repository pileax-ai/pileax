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
    async def get(self, key: str) -> Optional[Any]: ...

    @abstractmethod
    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        persist: Optional[bool] = False,
    ) -> None: ...

    @abstractmethod
    async def delete(self, key: str, persist: Optional[bool] = False) -> None: ...

    @abstractmethod
    async def clear(self) -> None: ...

    @abstractmethod
    async def test_connection(self) -> bool: ...

    async def set_persist(self, key: str, value: Any) -> None:
        obj = self.repo.find_one({"key": key})
        if obj:
            self.repo.update(obj, {"value": value})
        else:
            self.repo.create(DatabaseCache(key=key, value=value))

    async def delete_persist(self, key: str) -> None:
        self.repo.delete_all({"key": key})

    async def load(self) -> int:
        self.repo.delete_older_than(30)
        items = self.repo.find_all()
        for item in items:
            await self.set(item.key, item.value)

        return len(items)
