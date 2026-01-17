from typing import Any, Generic, TypeVar
from uuid import UUID

from fastapi import HTTPException, Request, Response, status
from pydantic import BaseModel
from sqlmodel import SQLModel

from app.api.models.auth import Signin, SigninPublic, Token, TokenPublic, UserSimple
from app.api.models.user import User
from app.api.services.auth_service import AuthService
from app.core.cache.factory import cache, get_key
from app.libs.cookie_helper import CookieHelper
from app.libs.helper import extract_remote_ip
from app.libs.jwt_service import JWTService

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class AuthController(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(
        self,
        session,
        request: Request,
        response: Response,
    ):
        self.service = AuthService(session)
        self.session = session
        self.request = request
        self.response = response

    async def signup(self, item_in: CreateSchemaType) -> SigninPublic:
        item = item_in.model_dump(by_alias=True)
        user = self.service.signup(User(**item))
        return await self.login(user)

    async def signin(self, email: str, password: str) -> SigninPublic:
        user = self.service.signin(Signin(email=email, password=password))
        return await self.login(user)

    async def signout(self, user_id: UUID) -> Any:
        # remove token in cache
        await self._remove_token_cache(str(user_id))

        # clear cookie
        CookieHelper.clear_tokens(self.response)

    async def login(self, user: User) -> SigninPublic:
        ip = extract_remote_ip(self.request)
        token = self.service.login(user, ip)

        # cache token
        await self._cache_token(str(user.id), token)

        # set cookies
        CookieHelper.set_tokens(self.response, token)

        return SigninPublic(
            user=UserSimple(**user.model_dump(by_alias=True)),
            token=TokenPublic(**token.model_dump(by_alias=True)),
        )

    async def refresh_token(self) -> TokenPublic:
        cookie_refresh_token = CookieHelper.get_refresh_token(self.request)
        if cookie_refresh_token is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No refresh token.",
            )

        # check refresh_token
        payload = JWTService().decode(cookie_refresh_token)
        user_id = payload.get("sub")
        cached_refresh_token = await cache.get(get_key("user", "refresh_token", user_id, self._device_id()))
        if cached_refresh_token != cookie_refresh_token:
            raise HTTPException(status_code=403, detail="Inactive refresh token")

        # issue new token
        token = self.service.refresh_token(cookie_refresh_token)

        # set cookies
        CookieHelper.set_tokens(self.response, token)

        # cache token
        await self._cache_token(user_id, token)

        return TokenPublic(**token.model_dump(by_alias=True))

    def get_token(self, email: str, password: str) -> TokenPublic:
        user = self.service.signin(Signin(email=email, password=password))
        ip = extract_remote_ip(self.request)
        token = self.service.login(user, ip)
        return TokenPublic(**token.model_dump(by_alias=True))

    def _device_id(self):
        return self.request.headers.get("X-Device-ID")

    async def _cache_token(self, user_id: str, token: Token):
        await cache.set(get_key("user", "access_token", user_id, self._device_id()), token.access_token, persist=True)
        await cache.set(get_key("user", "refresh_token", user_id, self._device_id()), token.refresh_token, persist=True)
        await cache.set(get_key("user", "csrf_token", user_id, self._device_id()), token.refresh_token, persist=True)

    async def _remove_token_cache(self, user_id: str):
        await cache.delete(get_key("user", "access_token", user_id, self._device_id()), persist=True)
        await cache.delete(get_key("user", "refresh_token", user_id, self._device_id()), persist=True)
        await cache.delete(get_key("user", "csrf_token", user_id, self._device_id()), persist=True)
