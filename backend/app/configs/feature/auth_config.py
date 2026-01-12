from pydantic import Field, PositiveInt
from pydantic_settings import BaseSettings


class AuthConfig(BaseSettings):
    """
    Configuration for authentication and OAuth
    """

    OAUTH_REDIRECT_PATH: str = Field(
        description="Redirect path for OAuth authentication callbacks",
        default="/console/api/oauth/authorize",
    )

    GITHUB_CLIENT_ID: str | None = Field(
        description="GitHub OAuth client ID",
        default=None,
    )

    GITHUB_CLIENT_SECRET: str | None = Field(
        description="GitHub OAuth client secret",
        default=None,
    )

    GOOGLE_CLIENT_ID: str | None = Field(
        description="Google OAuth client ID",
        default=None,
    )

    GOOGLE_CLIENT_SECRET: str | None = Field(
        description="Google OAuth client secret",
        default=None,
    )

    ACCESS_TOKEN_EXPIRE_MINUTES: PositiveInt = Field(
        description="Expiration time for access tokens in minutes",
        default=60,
    )

    REFRESH_TOKEN_EXPIRE_DAYS: PositiveInt = Field(
        description="Expiration time for refresh tokens in days",
        default=30,
    )

    LOGIN_LOCKOUT_DURATION: PositiveInt = Field(
        description="Time (in seconds) a user must wait before retrying login after exceeding the rate limit.",
        default=86400,
    )

    FORGOT_PASSWORD_LOCKOUT_DURATION: PositiveInt = Field(
        description="Time (in seconds) a user must wait before retrying password reset after exceeding the rate limit.",
        default=86400,
    )

    CHANGE_EMAIL_LOCKOUT_DURATION: PositiveInt = Field(
        description="Time (in seconds) a user must wait before retrying change email after exceeding the rate limit.",
        default=86400,
    )

    OWNER_TRANSFER_LOCKOUT_DURATION: PositiveInt = Field(
        description="Time (in seconds) a user must wait before retrying owner transfer after exceeding the rate limit.",
        default=86400,
    )

    EMAIL_REGISTER_LOCKOUT_DURATION: PositiveInt = Field(
        description="Time (in seconds) a user must wait before retrying email register after exceeding the rate limit.",
        default=86400,
    )
