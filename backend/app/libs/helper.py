import secrets
from datetime import datetime, UTC
from fastapi import Request
from typing import TYPE_CHECKING, Any, Optional, Union, cast

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


def get_current_time() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


class TokenHelper:
    @staticmethod
    def generate_refresh_token(length: int = 64) -> str:
        return secrets.token_hex(length)
