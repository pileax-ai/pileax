from pydantic import Field, PositiveInt, PositiveFloat, computed_field, AliasChoices
from pydantic_settings import BaseSettings


class HttpConfig(BaseSettings):
    """
    HTTP-related configurations for the application
    """

    COOKIE_DOMAIN: str = Field(
        description="Explicit cookie domain for console/service cookies when sharing across subdomains",
        default="",
    )

    API_COMPRESSION_ENABLED: bool = Field(
        description="Enable or disable gzip compression for HTTP responses",
        default=False,
    )

    inner_CONSOLE_CORS_ALLOW_ORIGINS: str = Field(
        description="Comma-separated list of allowed origins for CORS in the console",
        validation_alias=AliasChoices("CONSOLE_CORS_ALLOW_ORIGINS", "CONSOLE_WEB_URL"),
        default="",
    )

    @computed_field
    def CONSOLE_CORS_ALLOW_ORIGINS(self) -> list[str]:
        return self.inner_CONSOLE_CORS_ALLOW_ORIGINS.split(",")

    inner_WEB_API_CORS_ALLOW_ORIGINS: str = Field(
        description="",
        validation_alias=AliasChoices("WEB_API_CORS_ALLOW_ORIGINS"),
        default="*",
    )

    @computed_field
    def WEB_API_CORS_ALLOW_ORIGINS(self) -> list[str]:
        return self.inner_WEB_API_CORS_ALLOW_ORIGINS.split(",")

    HTTP_REQUEST_MAX_CONNECT_TIMEOUT: int = Field(
        ge=1, description="Maximum connection timeout in seconds for HTTP requests", default=10
    )

    HTTP_REQUEST_MAX_READ_TIMEOUT: int = Field(
        ge=1, description="Maximum read timeout in seconds for HTTP requests", default=600
    )

    HTTP_REQUEST_MAX_WRITE_TIMEOUT: int = Field(
        ge=1, description="Maximum write timeout in seconds for HTTP requests", default=600
    )

    HTTP_REQUEST_NODE_MAX_BINARY_SIZE: PositiveInt = Field(
        description="Maximum allowed size in bytes for binary data in HTTP requests",
        default=10 * 1024 * 1024,
    )

    HTTP_REQUEST_NODE_MAX_TEXT_SIZE: PositiveInt = Field(
        description="Maximum allowed size in bytes for text data in HTTP requests",
        default=1 * 1024 * 1024,
    )

    HTTP_REQUEST_NODE_SSL_VERIFY: bool = Field(
        description="Enable or disable SSL verification for HTTP requests",
        default=True,
    )

    SSRF_DEFAULT_MAX_RETRIES: PositiveInt = Field(
        description="Maximum number of retries for network requests (SSRF)",
        default=3,
    )

    SSRF_PROXY_ALL_URL: str | None = Field(
        description="Proxy URL for HTTP or HTTPS requests to prevent Server-Side Request Forgery (SSRF)",
        default=None,
    )

    SSRF_PROXY_HTTP_URL: str | None = Field(
        description="Proxy URL for HTTP requests to prevent Server-Side Request Forgery (SSRF)",
        default=None,
    )

    SSRF_PROXY_HTTPS_URL: str | None = Field(
        description="Proxy URL for HTTPS requests to prevent Server-Side Request Forgery (SSRF)",
        default=None,
    )

    SSRF_DEFAULT_TIME_OUT: PositiveFloat = Field(
        description="The default timeout period used for network requests (SSRF)",
        default=5,
    )

    SSRF_DEFAULT_CONNECT_TIME_OUT: PositiveFloat = Field(
        description="The default connect timeout period used for network requests (SSRF)",
        default=5,
    )

    SSRF_DEFAULT_READ_TIME_OUT: PositiveFloat = Field(
        description="The default read timeout period used for network requests (SSRF)",
        default=5,
    )

    SSRF_DEFAULT_WRITE_TIME_OUT: PositiveFloat = Field(
        description="The default write timeout period used for network requests (SSRF)",
        default=5,
    )

    SSRF_POOL_MAX_CONNECTIONS: PositiveInt = Field(
        description="Maximum number of concurrent connections for the SSRF HTTP client",
        default=100,
    )

    SSRF_POOL_MAX_KEEPALIVE_CONNECTIONS: PositiveInt = Field(
        description="Maximum number of persistent keep-alive connections for the SSRF HTTP client",
        default=20,
    )

    SSRF_POOL_KEEPALIVE_EXPIRY: PositiveFloat | None = Field(
        description="Keep-alive expiry in seconds for idle SSRF connections (set to None to disable)",
        default=5.0,
    )

    RESPECT_XFORWARD_HEADERS_ENABLED: bool = Field(
        description="Enable handling of X-Forwarded-For, X-Forwarded-Proto, and X-Forwarded-Port headers"
        " when the app is behind a single trusted reverse proxy.",
        default=False,
    )
