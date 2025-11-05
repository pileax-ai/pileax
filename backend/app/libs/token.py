import logging
import re
from datetime import UTC, datetime, timedelta

from fastapi import Request, Response

from app.constants import (
    COOKIE_NAME_ACCESS_TOKEN,
    COOKIE_NAME_CSRF_TOKEN,
    COOKIE_NAME_PASSPORT,
    COOKIE_NAME_REFRESH_TOKEN,
    COOKIE_NAME_WEBAPP_ACCESS_TOKEN,
    HEADER_NAME_CSRF_TOKEN,
    HEADER_NAME_PASSPORT,
)

logger = logging.getLogger(__name__)

CSRF_WHITE_LIST = [
    re.compile(r"/console/api/apps/[a-f0-9-]+/workflows/draft"),
]

