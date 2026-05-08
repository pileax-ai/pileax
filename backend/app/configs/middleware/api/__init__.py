from .douban_api_config import DoubanApiConfig
from .google_api_config import GoogleApiConfig


class ApiConfig(DoubanApiConfig, GoogleApiConfig):
    pass
