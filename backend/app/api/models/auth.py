import uuid
from typing import Optional

from sqlmodel import Field, SQLModel
from pydantic import BaseModel

from app.api.models.base import BaseSQLModel


class Signin(BaseModel):
    email: str
    password: str | None = None


class LoginUpdate(BaseModel):
    last_login_ip: Optional[str] = None
    last_login_time: Optional[str] = None


class TokenPublic(BaseModel):
    access_token: str
    token_type: str = "Bearer"


class Token(TokenPublic):
    refresh_token: str
    csrf_token: str


class TokenPayload(SQLModel):
    iss: str | None = None
    sub: str | None = None
    exp: int | None = None


class UserSimple(BaseModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    name: str | None = None
    avatar: str | None = None
    bio: str | None = None


class SigninPublic(BaseSQLModel):
    user: UserSimple
    token: TokenPublic


class SigninVo(BaseSQLModel):
    account: UserSimple
    token: str
