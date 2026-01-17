import time
import asyncio
from typing import Any, Optional

from .base import Cache


class MemoryCache(Cache):
    """
    In-process memory cache.
    Suitable for Electron / SQLite single-process runtime.
    """

    def __init__(self):
        super().__init__()
        self.enable_persist = True
        self._data: dict[str, tuple[Any, Optional[int]]] = {}
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Optional[Any]:
        async with self._lock:
            item = self._data.get(key)
            if not item:
                return None

            value, expires_at = item
            if expires_at is not None and expires_at < int(time.time()):
                # lazy eviction
                del self._data[key]
                return None

            return value

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        persist: Optional[bool] = False,
    ) -> None:
        expires_at = int(time.time()) + ttl if ttl else None
        async with self._lock:
            self._data[key] = (value, expires_at)

        if persist and self.enable_persist:
            await super().set_persist(key,value)

    async def delete(
        self,
        key: str,
        persist: Optional[bool] = False
    ) -> None:
        async with self._lock:
            self._data.pop(key, None)

        if persist and self.enable_persist:
            await super().delete_persist(key)

    async def clear(self) -> None:
        async with self._lock:
            self._data.clear()

    async def test_connection(self) -> bool:
        return True
