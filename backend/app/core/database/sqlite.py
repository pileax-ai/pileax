from sqlmodel import Session, SQLModel, create_engine, select

from app.core.database import events

sqlite_file_name = "metadata.db"
sqlite_url = f"sqlite:///storage/{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
