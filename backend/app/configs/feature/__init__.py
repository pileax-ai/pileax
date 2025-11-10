from .auth_config import AuthConfig
from .docs_config import SwaggerUIConfig
from .endpoint_config import EndpointConfig
from .file_config import FileConfig
from .http_config import HttpConfig
from .logging_config import LoggingConfig
from .security_config import SecurityConfig


class FeatureConfig(
    AuthConfig,
    EndpointConfig,
    FileConfig,
    HttpConfig,
    LoggingConfig,
    SecurityConfig,
    SwaggerUIConfig,
):
    pass
