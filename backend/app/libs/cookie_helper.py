from fastapi import Request, Response

from app.api.models.auth import Token
from app.configs import app_config
from app.constants import COOKIE_NAME_ACCESS_TOKEN, COOKIE_NAME_CSRF_TOKEN, COOKIE_NAME_REFRESH_TOKEN


class CookieHelper:
    @staticmethod
    def get_refresh_token(request: Request) -> str | None:
        return request.cookies.get(COOKIE_NAME_REFRESH_TOKEN)

    @staticmethod
    def set_access_token(response: Response, token: str, samesite: str = "Lax"):
        response.set_cookie(
            COOKIE_NAME_ACCESS_TOKEN,
            value=token,
            httponly=True,
            domain=app_config.COOKIE_DOMAIN,
            secure=False,
            samesite=samesite,
            max_age=app_config.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            path="/",
        )

    @staticmethod
    def set_refresh_token(response: Response, token: str, samesite: str = "Lax"):
        response.set_cookie(
            COOKIE_NAME_REFRESH_TOKEN,
            value=token,
            httponly=True,
            domain=app_config.COOKIE_DOMAIN,
            secure=False,
            samesite=samesite,
            max_age=app_config.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
            path="/",
        )

    @staticmethod
    def set_csrf_token(response: Response, token: str, samesite: str = "Lax"):
        response.set_cookie(
            COOKIE_NAME_CSRF_TOKEN,
            value=token,
            httponly=True,
            domain=app_config.COOKIE_DOMAIN,
            secure=False,
            samesite=samesite,
            max_age=3600,
            path="/",
        )

    @staticmethod
    def clear_cookie(
        response: Response,
        key: str,
        samesite: str = "Lax",
        httponly: bool = True,
    ):
        response.set_cookie(
            key,
            "",
            expires=0,
            path="/",
            domain=app_config.COOKIE_DOMAIN,
            secure=False,
            httponly=httponly,
            samesite=samesite,
        )

    @staticmethod
    def set_tokens(response: Response, token: Token):
        CookieHelper.set_refresh_token(response, token.refresh_token, samesite="Strict")
        CookieHelper.set_csrf_token(response, token.csrf_token, samesite="Strict")

    @staticmethod
    def clear_tokens(response: Response):
        CookieHelper.clear_cookie(response, COOKIE_NAME_REFRESH_TOKEN, samesite="Strict")
        CookieHelper.clear_cookie(response, COOKIE_NAME_CSRF_TOKEN, samesite="Strict")
