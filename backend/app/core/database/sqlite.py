import logging

from sqlmodel import Session, SQLModel, create_engine, select

from app.core.config import settings
from app.core.database import events

logger = logging.getLogger(__name__)

sqlite_url = f"sqlite://{settings.DATABASE_URL}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    logger.info(f"Creating database and tables: {sqlite_url}")
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
