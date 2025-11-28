import builtins
import logging
import time

from fastapi import FastAPI

from app.configs import app_config


logger = logging.getLogger(__name__)
order = -1


def is_enabled():
    return False


def setup_import_timer():
    """
    Show slow import
    """
    original_import = builtins.__import__

    def timed_import(name, *args, **kwargs):
        start = time.time()
        module = original_import(name, *args, **kwargs)
        duration = time.time() - start
        if duration > 0.5:
            logger.warning(f"[IMPORT SLOW] {name}: {duration:.3f}s")
        return module

    builtins.__import__ = timed_import


def setup(app: FastAPI):
    if is_enabled():
        setup_import_timer()
