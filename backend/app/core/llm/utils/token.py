import os
from threading import Lock

import tiktoken

from app.libs.file_utils import get_cache_dir

_ENCODING_NAME = "cl100k_base"
_TIKTOKEN_CACHE_DIR = get_cache_dir("tiktoken")
os.environ.setdefault("TIKTOKEN_CACHE_DIR", _TIKTOKEN_CACHE_DIR)


# ---------------------------------------------------------------------
# Encoder singleton (process-level)
# ---------------------------------------------------------------------
_encoder = None
_lock = Lock()


def get_encoder():
    """
    Lazily load tiktoken encoder.
    Must NOT be executed at import time.
    """
    global _encoder

    if _encoder is not None:
        return _encoder

    with _lock:
        if _encoder is not None:
            return _encoder

        try:
            _encoder = tiktoken.get_encoding(_ENCODING_NAME)
            return _encoder
        except Exception as e:
            raise RuntimeError(
                f"Failed to initialize tiktoken encoder '{_ENCODING_NAME}'. "
                f"TIKTOKEN_CACHE_DIR={os.environ.get('TIKTOKEN_CACHE_DIR')}. "
                "Ensure the cache is preloaded or network access is available."
            ) from e


# ---------------------------------------------------------------------
# Token helpers
# ---------------------------------------------------------------------
def num_tokens_from_string(text: str) -> int:
    """
    Return token count for a string.

    Returns 0 only if text is empty.
    Any tokenizer failure is propagated.
    """
    if not text:
        return 0

    encoder = get_encoder()
    return len(encoder.encode(text))


def truncate(text: str, max_len: int) -> str:
    """
    Truncate text by token length.
    """
    if not text or max_len <= 0:
        return ""

    encoder = get_encoder()
    tokens = encoder.encode(text)
    return encoder.decode(tokens[:max_len])


# ---------------------------------------------------------------------
# Response token extraction (defensive)
# ---------------------------------------------------------------------
def total_token_count_from_response(resp):
    """
    Extract total token count from various LLM response formats.
    Never raises.
    """
    try:
        if hasattr(resp, "usage") and hasattr(resp.usage, "total_tokens"):
            return int(resp.usage.total_tokens)

        if hasattr(resp, "usage_metadata") and hasattr(resp.usage_metadata, "total_tokens"):
            return int(resp.usage_metadata.total_tokens)

        if isinstance(resp, dict):
            usage = resp.get("usage")
            if usage:
                if "total_tokens" in usage:
                    return int(usage["total_tokens"])
                if "input_tokens" in usage and "output_tokens" in usage:
                    return int(usage["input_tokens"]) + int(usage["output_tokens"])

            meta = resp.get("meta", {})
            tokens = meta.get("tokens", {})
            if "input_tokens" in tokens and "output_tokens" in tokens:
                return int(tokens["input_tokens"]) + int(tokens["output_tokens"])
    except Exception:
        pass

    return 0
