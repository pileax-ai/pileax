from typing import Generic, Optional, TypeVar
from uuid import UUID

from fastapi import HTTPException, Request, Response, status
from pydantic import BaseModel
from sqlmodel import SQLModel

from app.api.models.auth import Signin, SigninPublic, TokenPublic, UserSimple
from app.api.models.user import User
from app.api.services.auth_service import AuthService
from app.libs.cookie_helper import CookieHelper
from app.libs.helper import extract_remote_ip

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
        user = self.service.signin(Signin(email=email, password=password))
        return self.login(user)

    def login(self, user: User) -> SigninPublic:
        ip = extract_remote_ip(self.request)
        token = self.service.login(user, ip)

        # set cookies
        CookieHelper.set_token(self.response, token)

        return SigninPublic(
            user=UserSimple(**user.model_dump(by_alias=True)),
            token=TokenPublic(**token.model_dump(by_alias=True)),
        )

    def refresh_token(self) -> TokenPublic:
        cookie_refresh_token = CookieHelper.get_refresh_token(self.request)
        if cookie_refresh_token is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No refresh token.",
            )
        # todo: check refresh_token
        token = self.service.refresh_token(cookie_refresh_token)

        # set cookies
        CookieHelper.set_token(self.response, token)

        # todo: remove old refresh_token
        return TokenPublic(**token.model_dump(by_alias=True))

    def get_token(self, email: str, password: str) -> TokenPublic:
        user = self.service.signin(Signin(email=email, password=password))
        ip = extract_remote_ip(self.request)
        token = self.service.login(user, ip)
        return TokenPublic(**token.model_dump(by_alias=True))
