import logging
import re

logger = logging.getLogger(__name__)

CSRF_WHITE_LIST = [
    re.compile(r"/console/api/apps/[a-f0-9-]+/workflows/draft"),
]

