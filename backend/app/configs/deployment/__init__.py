from pydantic import Field
from pydantic_settings import BaseSettings


class DeploymentConfig(BaseSettings):
    """
    Configuration settings for application deployment
    """

    APPLICATION_NAME: str = Field(
        description="Name of the application, used for display",
        default="PileaX",
    )

    APPLICATION_CODE: str = Field(
        description="Code of the application, used for identification and logging purposes",
        default="pileax",
    )

    DEBUG: bool = Field(
        description="Enable debug mode for additional logging and development features",
        default=False,
    )

    # Request logging configuration
    ENABLE_REQUEST_LOGGING: bool = Field(
        description="Enable request and response body logging",
        default=False,
    )

    DEPLOY_EDITION: str = Field(
        description="Deployment edition of the application (e.g., 'STANDALONE', 'SELF_HOSTED', 'CLOUD')",
        default="SELF_HOSTED",
    )

    DEPLOY_ENV: str = Field(
        description="Deployment environment (e.g., 'DEVELOPMENT', 'STAGING', 'PRODUCTION')",
        default="PRODUCTION",
    )

    PORT: int = Field(description="Listening port for deployment", default=8000)
