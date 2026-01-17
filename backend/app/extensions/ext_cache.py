import logging

from fastapi import FastAPI

from app.core.cache.factory import cache

logger = logging.getLogger(__name__)
order = -1


def is_enabled():
    return False


async def test_connection():
    cache_name = cache.__class__.__name__

    if cache_name == "RedisCache":
        try:
            connected = await cache.test_connection()
            if connected:
                logger.info("✅ Cache connected.")
            else:
                logger.info("❌ Cache not connected.")
        except Exception as e:
            logger.error("❌ Cache connection failed. %s", e)

    return cache_name


async def load_cache():
    return await cache.load()


async def setup(app: FastAPI | None = None):
    cache_name = await test_connection()
    cache_len = await load_cache()
    logger.info("✅ [%s] Cache backend is setup. %s keys loaded", cache_name, cache_len)
