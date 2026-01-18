import uuid
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel

from app.api.models.base import BaseSQLModel, BaseApiModel


class Signin(BaseApiModel):
    email: str
    password: str


class Signup(Signin):
    name: str


class LoginUpdate(BaseApiModel):
    last_login_ip: Optional[str] = None
    last_login_time: Optional[datetime] = None


class TokenPublic(BaseApiModel):
    access_token: str
    token_type: str = "Bearer"


class Token(TokenPublic):
    refresh_token: str
    csrf_token: str


class TokenPayload(SQLModel):
    iss: str | None = None
    sub: str | None = None
    exp: int | None = None


class UserSimple(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    name: str | None = None
    email: str | None = None
    avatar: str | None = None
    bio: str | None = None


class SigninPublic(BaseSQLModel):
    user: UserSimple
    token: TokenPublic


class SigninVo(BaseSQLModel):
    account: UserSimple
    token: str
