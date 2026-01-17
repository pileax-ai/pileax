import logging

from fastapi import FastAPI

from app.core.cache.factory import get_cache

logger = logging.getLogger(__name__)
order = -1


def is_enabled():
    return False


def test_connection():
    cache = get_cache()
    cache_name = cache.__class__.__name__

    if cache_name == "RedisCache":
        try:
            connected = cache.test_connection()
            if connected:
                logger.info("✅ Cache connected.")
            else:
                logger.info("❌ Cache not connected.")
        except Exception as e:
            logger.error("❌ Cache connection failed. %s", e)

    return cache_name


def load_cache():
    cache = get_cache()
    return cache.load()


def setup(app: FastAPI | None = None):
    cache_name = test_connection()
    cache_len = load_cache()
    logger.info("✅ [%s] Cache backend is setup. %s keys loaded", cache_name, cache_len)
