"""
Description: middlewares, exception handlers, and global setup etc.
"""
import importlib
import logging
import operator
import time
from typing import Any

from fastapi import FastAPI

logger = logging.getLogger(__name__)

EXT_NAMES = [
    'ai',
    'cors',
    'database',
    'docs',
    'exception',
    'logging',
    'perf',
    'router',
    'static',
]
EXT_MODULES = [f"{__name__}.ext_{name}" for name in EXT_NAMES]


def setup_extensions(app: FastAPI):
    extensions: list[tuple[Any, int, str]] = []

    # Don't use pkgutil.iter_modules when pyinstaller used
    # for module_info in pkgutil.iter_modules(__path__):
    #     module_name = f"{__name__}.{module_info.name}"
    for module_name in EXT_MODULES:
        ext = importlib.import_module(module_name)
        order = getattr(ext, "order", 0)
        if order >= 0:
            short_name = ext.__name__.split(".")[-1]
            extensions.append((ext, order, short_name))

    extensions.sort(key=operator.itemgetter(1))
    names = "\n".join([f"{i + 1}. {name} (order={order})" for i, (_, order, name) in enumerate(extensions)])
    logging.warning("\n\nLoading Extensions:\n%s \n", names)

    for ext, order, short_name in extensions:
        setup_extension(app, ext, short_name)


def setup_extension(app: FastAPI, ext: Any, short_name: str):
    is_enabled = ext.is_enabled() if hasattr(ext, "is_enabled") else True

    if not is_enabled:
        logger.warning("Skipped %s", short_name)
        return

    if not hasattr(ext, "setup"):
        logger.warning("Extension %s has no setup() method", short_name)
        return

    start_time = time.perf_counter()
    ext.setup(app)
    end_time = time.perf_counter()

    logger.info("Setup %s (%s ms)", short_name, round((end_time - start_time) * 1000, 2))
