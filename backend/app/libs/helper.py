import re
from datetime import UTC, datetime
from typing import cast

from fastapi import Request


def extract_remote_ip(request: Request) -> str:
    # Cloudflare
    cf_ip = request.headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip.strip()

    # Proxy
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()

    # Default
    return cast(str, request.client.host)


def get_current_time() -> datetime:
    return datetime.now(UTC)


class StringHelper:
    @staticmethod
    def to_camel(snake_str: str) -> str:
        """
        Convert to camelCase
        """
        parts = snake_str.split('_')
        return parts[0].lower() + ''.join(word.capitalize() for word in parts[1:])

    @staticmethod
    def to_snake(camel_str: str) -> str:
        """
        Convert to snake case
        """
        return re.sub(r'(?<!^)(?=[A-Z])', '_', camel_str).lower()
