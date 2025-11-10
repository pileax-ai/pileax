import hashlib
import logging
import os
from tempfile import gettempdir

from alembic import command
from alembic.config import Config
from fastapi import FastAPI
from filelock import FileLock
from sqlmodel import Session, create_engine

from app.configs import app_config

logger = logging.getLogger(__name__)
order = 0

if app_config.DB_PROVIDER == 'sqlite':
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

def create_new_engine():
    return create_engine(
        str(app_config.SQLALCHEMY_DATABASE_URI),
        connect_args=connect_args,
        pool_pre_ping=True,
    )


engine = create_new_engine()


def get_db_session():
    with Session(engine) as session:
        yield session


def get_migration_lock_file():
    db_hash = hashlib.md5(str(app_config.SQLALCHEMY_DATABASE_URI).encode()).hexdigest()
    dir_path = os.path.join(gettempdir(), "pileax")
    os.makedirs(dir_path, exist_ok=True)
    return os.path.join(dir_path, f"alembic_{db_hash}.lock")


def run_migrations():
    """
    Run migrations after app started.
    Use lock_file to ensure run once.
    """
    lock_file = get_migration_lock_file()

    with FileLock(lock_file):
        alembic_cfg = Config("alembic.ini")

        temp_engine = create_new_engine()
        with temp_engine.connect() as connection:
            alembic_cfg.attributes["connection"] = connection
            command.upgrade(alembic_cfg, "head")

def is_enabled():
    """
    Disabled in extensions loading.
    Migrations should be setup after app starts.
    """
    return False


def setup(app: FastAPI | None = None):
    # run migration
    run_migrations()
    logger.info("✅ Database migration is setup.")
