import hashlib
import logging
import os
from datetime import UTC, datetime

from alembic.config import Config
from fastapi import FastAPI
from filelock import FileLock
from sqlalchemy import event
from sqlmodel import Session, create_engine

from alembic import command
from app.configs import app_config
from app.libs.file_utils import get_cache_dir, get_root_dir

logger = logging.getLogger(__name__)
order = -1

if app_config.DB_PROVIDER == "sqlite":
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


@event.listens_for(Session, "before_flush")
def auto_update_modified_time(session, flush_context, instances):
    for obj in session.dirty:
        if hasattr(obj, "update_time"):
            try:
                obj.update_time = datetime.now(UTC)
            except AttributeError:
                pass


def get_migration_lock_file():
    db_hash = hashlib.md5(str(app_config.SQLALCHEMY_DATABASE_URI).encode()).hexdigest()
    dir_path = get_cache_dir("tmp", "alembic")
    os.makedirs(dir_path, exist_ok=True)
    return os.path.join(dir_path, f"alembic_{db_hash}.lock")


def run_migrations():
    """
    Run migrations after app started.
    Use lock_file to ensure run once.
    """
    logger.info("Running migrations: %s", str(app_config.SQLALCHEMY_DATABASE_URI))
    lock_file = get_migration_lock_file()

    with FileLock(lock_file):
        cfg_file_path = get_root_dir("alembic.ini")
        logger.info("alembic init file: %s", cfg_file_path)
        alembic_cfg = Config(cfg_file_path)

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
    logger.info("✅ [%s] Database migration is setup.", app_config.DB_PROVIDER)
