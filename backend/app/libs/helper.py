import re
from datetime import UTC, datetime
from typing import cast

from fastapi import Request
from nanoid import generate
from pypinyin import Style, lazy_pinyin


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
        parts = snake_str.split("_")
        return parts[0].lower() + "".join(word.capitalize() for word in parts[1:])

    @staticmethod
    def to_snake(camel_str: str) -> str:
        """
        Convert to snake case
        """
        return re.sub(r"(?<!^)(?=[A-Z])", "_", camel_str).lower()

    @staticmethod
    def to_pinyin(text: str, capitalize=False) -> str:
        if capitalize:
            pinyin_list = [p.capitalize() for p in lazy_pinyin(text or "", style=Style.NORMAL, v_to_u=True)]
            return "".join(pinyin_list)
        else:
            return "".join(lazy_pinyin(text or "", style=Style.NORMAL, v_to_u=True))

    @staticmethod
    def generate_short_id(size: int = 12) -> str:
        """
        Generate short id
        :param size: Size of short id
        :return: Example: '4kPq9XmRz2Tv'
        """
        alphabet = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ"
        return generate(alphabet, size)

    @staticmethod
    def generate_share_id(title: str) -> str:
        title = StringHelper.to_pinyin(title, capitalize=True)
        slug = re.sub(r"[^a-zA-Z0-9\s-]", "", title)
        slug = re.sub(r"[\s-]+", "-", slug).strip()
        sid = StringHelper.generate_short_id(16)

        if not slug:
            slug = "Note"

        return f"{slug[:32]}-{sid}"
