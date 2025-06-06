from datetime import timedelta

from fastapi import HTTPException

from app.api.deps import DEFAULT_USER_ID
from app.api.models.auth import Token
from app.api.models.user import User
from app.api.services.user_service import UserService
from app.core import security
from app.core.config import settings


class AuthService:
    def __init__(self, session):
        self.service = UserService(session)

    def signin(self, name: str, password: str) -> Token:
        app_mode = settings.APP_MODE
        if app_mode == "SINGLE":
            return self.signin_single()
        else:
            return self.signin_multiple(name, password)


    def signin_single(self) -> Token:
        """
        Signin in SINGLE mode
        """
        try:
            user = self.service.get(DEFAULT_USER_ID)
        except HTTPException as e:
            user = User(
                id=DEFAULT_USER_ID,
                name='default',
            )
            self.service.save(user)

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token = Token(
            access_token=security.create_access_token(
                user.id,
                expires_delta=access_token_expires
            )
        )
        return token


    def signin_multiple(self, name: str, password: str) -> Token:
        """
        Signin in MULTIPLE mode
        """
        user = self.service.get(DEFAULT_USER_ID)
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token = Token(
            access_token=security.create_access_token(
                user.id,
                expires_delta=access_token_expires
            )
        )
        return token
