from datetime import timedelta
from typing import Optional, TypeVar, Generic, Any

from fastapi import Request, Response
from pydantic import BaseModel
from sqlmodel import SQLModel
from uuid import UUID

from app.core import security
from app.core.config import settings
from app.libs.cookie_helper import CookieHelper
from app.libs.helper import extract_remote_ip
from app.api.models.auth import Signin, SigninPublic, Token, UserSimple, TokenPublic
from app.api.models.user import User
from app.api.services.auth_service import AuthService

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class AuthController(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, session,
                 request: Optional[Request] = None,
                 response: Optional[Response] = None,
                 user_id: Optional[UUID] = None
                 ):
        self.service = AuthService(session)
        self.session = session
        self.request = request
        self.response = response
        self.user_id = user_id

    def signup(self, item_in: CreateSchemaType) -> SigninPublic:
        item = item_in.model_dump(by_alias=True)
        user = self.service.signup(User(**item))
        return self.login(user)

    def signin(self, email: str, password: str) -> SigninPublic:
        data = Signin(email=email, password=password)
        user = self.service.signin(data)
        return self.login(user)

    def login(self, user: User) -> SigninPublic:
        ip = extract_remote_ip(self.request)
        token = self.service.login(user, ip)

        # cookie
        CookieHelper.set_token(self.response, token)

        return SigninPublic(
            user=UserSimple(**user.model_dump(by_alias=True)),
            token=TokenPublic(**token.model_dump(by_alias=True)),
        )
