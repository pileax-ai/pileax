from fastapi import Request, Response

from app.api.models.auth import Token
from app.configs import app_config
from app.constants import COOKIE_NAME_ACCESS_TOKEN, COOKIE_NAME_REFRESH_TOKEN, COOKIE_NAME_CSRF_TOKEN


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
    def set_token(response: Response, token: Token):
        # CookieHelper.set_access_token(response, token.access_token)
        CookieHelper.set_refresh_token(response, token.refresh_token, samesite="Strict")
        CookieHelper.set_csrf_token(response, token.csrf_token, samesite="Strict")
