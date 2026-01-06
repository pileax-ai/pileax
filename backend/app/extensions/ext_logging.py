import logging
import os
import sys

from fastapi import FastAPI

from app.configs import app_config
from app.libs.file_utils import get_cache_dir

order = 1


def setup(app: FastAPI):
    app_name = app_config.APPLICATION_CODE
    filename = get_cache_dir("log", "console.log")
    format = f"%(asctime)s - %(levelname)s \t[{app_name}] %(process)d [%(name)s] %(funcName)s \t: %(message)s"
    datefmt = "%Y-%m-%d %H:%M:%S"

    # Log path
    if not os.path.exists(os.path.dirname(filename)):
        os.makedirs(os.path.dirname(filename))

    formatter = logging.Formatter(format, datefmt)

    # File handler
    file_handler = logging.FileHandler(filename, encoding="utf-8", mode="w")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)

    # Remove existing handlers
    root = logging.getLogger()
    for h in root.handlers[:]:
        root.removeHandler(h)

    # Add new handlers
    root.addHandler(file_handler)
    root.addHandler(console_handler)
    root.setLevel(logging.DEBUG)
    root.propagate = False
