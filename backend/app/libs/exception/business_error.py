from typing import Any


class BusinessError(Exception):
    def __init__(self, status_code: int, detail: str, error_code: str = "GENERIC_ERROR", data: Any = None):
        self.status_code = status_code
        self.detail = detail
        self.error_code = error_code
        self.data = data
