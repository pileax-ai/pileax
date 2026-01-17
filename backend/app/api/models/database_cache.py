from sqlmodel import Field

from app.api.models.base import BaseMixin, BaseSQLModel


class DatabaseCache(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "database_cache"

    key: str = Field(...)
    value: str = Field(...)
