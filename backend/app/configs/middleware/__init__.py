from .cache import CacheConfig
from .database.database_config import DatabaseConfig
from .storage import StorageConfig


class MiddlewareConfig(
    CacheConfig,
    DatabaseConfig,
    StorageConfig,
):
    pass
