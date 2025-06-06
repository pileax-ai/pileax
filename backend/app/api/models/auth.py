import uuid

from sqlmodel import Field, SQLModel
from pydantic import BaseModel

from app.api.models.common import BaseSQLModel, UUIDString, TimestampMixin


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str | None = None


class UserSimple(BaseModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    name: str | None = None
    avatar: str | None = None
    bio: str | None = None


class SigninPublic(BaseSQLModel):
    user: UserSimple
    token: Token
