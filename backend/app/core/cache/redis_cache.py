import json
from typing import Any, Optional

from redis.asyncio import Redis

from .base import Cache, UUIDEncoder


class RedisCache(Cache):
    def __init__(self, redis: Redis):
        super().__init__()
        self.redis = redis
        self.enable_persist = True

    async def get(self, key: str):
        """
        Get value from Redis
        :param key: Key
        :return: dict, str or None
        """
        value = await self.redis.get(key)
        if value is None:
            return None
        try:
            # 1. Attempt to parse JSON string back to dict
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            # 2. Return as-is if it's not a JSON string (e.g., raw bytes/str)
            return value

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        persist: Optional[bool] = False,
    ) -> None:
        """
        Set value to Redis
        Auto serialize to json string
        """
        # 1. Handle Pydantic models (v2)
        if hasattr(value, "model_dump"):
            value = value.model_dump(mode="json")
        # 2. Handle dicts that might contain UUIDs
        elif isinstance(value, (dict, list)):
            value = json.dumps(value, cls=UUIDEncoder)

        if ttl:
            await self.redis.setex(key, ttl, value)
        else:
            await self.redis.set(key, value)

        if persist and self.enable_persist:
            await super().set_persist(key, value)

    async def delete(self, key: str, persist: Optional[bool] = False) -> None:
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
