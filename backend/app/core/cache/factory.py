from functools import lru_cache

from ...configs import app_config
from .base import Cache
from .memory_cache import MemoryCache
from .redis_cache import RedisCache

PREFIX = "pileax"


@lru_cache(maxsize=1)
def get_cache() -> Cache:
    """
    Create cache instance
    """
    if app_config.DB_PROVIDER != "sqlite":
        from redis.asyncio import Redis

        redis_url = app_config.REDIS_URL
        if not redis_url:
            raise RuntimeError("CACHE_BACKEND=redis but REDIS_URL is not set")

        redis = Redis.from_url(
            redis_url,
            decode_responses=True,
        )
        return RedisCache(redis)

    # default: in-process memory cache (When use SQLite)
    return MemoryCache()


def get_key(*parts: str) -> str:
    """
    Generate a Redis key with unified prefix and colon separator.
    Example:
        generate_key("user", user_id) -> pileax:user:123
    """
    clean_parts = [str(p) for p in parts]
    return f"{PREFIX}:" + ":".join(clean_parts)


cache: Cache = get_cache()
