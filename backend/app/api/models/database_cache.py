from sqlalchemy import UniqueConstraint
from sqlmodel import Field

from app.api.models.base import BaseMixin, BaseSQLModel


class DatabaseCache(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "database_cache"
    __table_args__ = (UniqueConstraint("key", name="unique_key"),)

    key: str = Field(...)
    value: str = Field(...)
