from typing import Any, Optional

from redis.asyncio import Redis


from .base import Cache

class RedisCache(Cache):
    def __init__(self, redis: Redis):
        super().__init__()
        self.redis = redis
        self.enable_persist = True

    async def get(self, key: str):
        return await self.redis.get(key)

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        persist: Optional[bool] = False,
    ) -> None:
        if ttl:
            await self.redis.setex(key, ttl, value)
        else:
            await self.redis.set(key, value)

        if persist and self.enable_persist:
            await super().set_persist(key,value)

    async def delete(
        self,
        key: str,
        persist: Optional[bool] = False
    ) -> None:
        await self.redis.delete(key)

        if persist and self.enable_persist:
            await super().delete_persist(key)

    async def clear(self) -> None:
        await self.redis.flushdb()

    async def test_connection(self) -> bool:
        pong = await self.redis.ping()
        if pong:
            return True
        else:
            return False
