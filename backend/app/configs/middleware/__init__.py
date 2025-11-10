from .database.database_config import DatabaseConfig
from .storage import StorageConfig


class MiddlewareConfig(
    DatabaseConfig,
    StorageConfig,
):
    pass
