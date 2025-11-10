from pydantic import Field
from pydantic_settings import BaseSettings


class EndpointConfig(BaseSettings):
    """
    Configuration for various application endpoints and URLs
    """

    CONSOLE_API_URL: str = Field(
        description="Base URL for the console API,"
        "used for login authentication callback or notion integration callbacks",
        default="",
    )

    CONSOLE_WEB_URL: str = Field(
        description="Base URL for the console web interface,used for frontend references and CORS configuration",
        default="",
    )

    SERVICE_API_URL: str = Field(
        description="Base URL for the service API, displayed to users for API access",
        default="",
    )

    APP_WEB_URL: str = Field(
        description="Base URL for the web application, used for frontend references",
        default="",
    )

    ENDPOINT_URL_TEMPLATE: str = Field(
        description="Template url for endpoint plugin", default="http://localhost:5002/e/{hook_id}"
    )
