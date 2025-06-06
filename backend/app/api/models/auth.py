import uuid

from sqlalchemy import Column
from sqlmodel import Field, SQLModel
from pydantic import BaseModel

from app.api.models.common import BaseSQLModel, UUIDString, TimestampMixin


class Token(BaseSQLModel):
    token: str
    token_type: str = "bearer"
