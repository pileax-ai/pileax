from .api import ApiConfig
from .cache import CacheConfig
from .database.database_config import DatabaseConfig
from .storage import StorageConfig


class MiddlewareConfig(
    ApiConfig,
    CacheConfig,
    DatabaseConfig,
    StorageConfig,
):
    pass
