from typing import Any, Optional

from redis.asyncio import Redis


from .base import Cache

class RedisCache(Cache):
    def __init__(self, redis: Redis):
        super().__init__()
        self.redis = redis

    def get(self, key: str):
        return self.redis.get(key)

    def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        persist: Optional[bool] = False,
    ) -> None:
        if ttl:
            self.redis.setex(key, ttl, value)
        else:
            self.redis.set(key, value)

        if persist:
            super().persist(key,value)

    def delete(self, key: str) -> None:
        self.redis.delete(key)

    def clear(self) -> None:
        self.redis.flushdb()

    def test_connection(self) -> bool:
        pong = self.redis.ping()
        if pong:
            return True
        else:
            return False
