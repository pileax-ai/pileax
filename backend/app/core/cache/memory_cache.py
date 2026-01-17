import time
import threading
from typing import Any, Optional

from .base import Cache


class MemoryCache(Cache):
    """
    In-process memory cache.
    Suitable for Electron / SQLite single-process runtime.
    """

    def __init__(self):
        super().__init__()
        self._data: dict[str, tuple[Any, Optional[int]]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            item = self._data.get(key)
            if not item:
                return None

            value, expires_at = item
            if expires_at is not None and expires_at < int(time.time()):
                # lazy eviction
                del self._data[key]
                return None

            return value

    def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        persist: Optional[bool] = False,
    ) -> None:
        expires_at = int(time.time()) + ttl if ttl else None
        with self._lock:
            self._data[key] = (value, expires_at)

        if persist:
            super().persist(key,value)

    def delete(self, key: str) -> None:
        with self._lock:
            self._data.pop(key, None)

    def clear(self) -> None:
        with self._lock:
            self._data.clear()

    def test_connection(self) -> bool:
        return True
