from pydantic import Field, PositiveInt
from pydantic_settings import BaseSettings


class SecurityConfig(BaseSettings):
    """
    Security-related configurations for the application
    """

    SECRET_KEY: str = Field(
        description="Secret key for secure session cookie signing."
        "Make sure you are changing this key for your deployment with a strong key."
        "Generate a strong key using `openssl rand -base64 42` or set via the `SECRET_KEY` environment variable.",
        default="",
    )

    RESET_PASSWORD_TOKEN_EXPIRY_MINUTES: PositiveInt = Field(
        description="Duration in minutes for which a password reset token remains valid",
        default=5,
    )

    EMAIL_REGISTER_TOKEN_EXPIRY_MINUTES: PositiveInt = Field(
        description="Duration in minutes for which a email register token remains valid",
        default=5,
    )

    CHANGE_EMAIL_TOKEN_EXPIRY_MINUTES: PositiveInt = Field(
        description="Duration in minutes for which a change email token remains valid",
        default=5,
    )

    OWNER_TRANSFER_TOKEN_EXPIRY_MINUTES: PositiveInt = Field(
        description="Duration in minutes for which a owner transfer token remains valid",
        default=5,
    )

    LOGIN_DISABLED: bool = Field(
        description="Whether to disable login checks",
        default=False,
    )

    ADMIN_API_KEY_ENABLE: bool = Field(
        description="Whether to enable admin api key for authentication",
        default=False,
    )

    ADMIN_API_KEY: str | None = Field(
        description="admin api key for authentication",
        default=None,
    )
