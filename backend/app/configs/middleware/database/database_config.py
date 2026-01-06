import os
from typing import Any
from urllib.parse import parse_qsl

from pydantic import Field, NonNegativeInt, PositiveInt, PostgresDsn, computed_field
from pydantic_settings import BaseSettings


class DatabaseConfig(BaseSettings):
    DB_PROVIDER: str = Field(
        description="Database provider.",
        default="postgresql",
    )

    DB_HOST: str = Field(
        description="Hostname or IP address of the database server.",
        default="localhost",
    )

    DB_PORT: PositiveInt = Field(
        description="Port number for database connection.",
        default=5432,
    )

    DB_USERNAME: str = Field(
        description="Username for database authentication.",
        default="postgres",
    )

    DB_PASSWORD: str = Field(
        description="Password for database authentication.",
        default="",
    )

    DB_DATABASE: str = Field(
        description="Name of the database to connect to.",
        default="pileax",
    )

    DB_CHARSET: str = Field(
        description="Character set for database connection.",
        default="",
    )

    DB_EXTRAS: str = Field(
        description="Additional database connection parameters. Example: 'keepalives_idle=60&keepalives=1'",
        default="",
    )

    SQLALCHEMY_DATABASE_URI_SCHEME: str = Field(
        description="Database URI scheme for SQLAlchemy connection.",
        default="postgresql",
    )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str | Any:
        match self.DB_PROVIDER.lower():
            case "postgresql":
                return PostgresDsn.build(
                    scheme="postgresql+psycopg",
                    username=self.DB_USERNAME,
                    password=self.DB_PASSWORD,
                    host=self.DB_HOST,
                    port=self.DB_PORT,
                    path=self.DB_DATABASE,
                )
            case "sqlite":
                return f"sqlite:///{self.DB_DATABASE}"
            case _:
                return ""

    SQLALCHEMY_POOL_SIZE: NonNegativeInt = Field(
        description="Maximum number of database connections in the pool.",
        default=30,
    )

    SQLALCHEMY_MAX_OVERFLOW: NonNegativeInt = Field(
        description="Maximum number of connections that can be created beyond the pool_size.",
        default=10,
    )

    SQLALCHEMY_POOL_RECYCLE: NonNegativeInt = Field(
        description="Number of seconds after which a connection is automatically recycled.",
        default=3600,
    )

    SQLALCHEMY_POOL_USE_LIFO: bool = Field(
        description="If True, SQLAlchemy will use last-in-first-out way to retrieve connections from pool.",
        default=False,
    )

    SQLALCHEMY_POOL_PRE_PING: bool = Field(
        description="If True, enables connection pool pre-ping feature to check connections.",
        default=False,
    )

    SQLALCHEMY_ECHO: bool | str = Field(
        description="If True, SQLAlchemy will log all SQL statements.",
        default=False,
    )

    SQLALCHEMY_POOL_TIMEOUT: NonNegativeInt = Field(
        description="Number of seconds to wait for a connection from the pool before raising a timeout error.",
        default=30,
    )

    RETRIEVAL_SERVICE_EXECUTORS: NonNegativeInt = Field(
        description="Number of processes for the retrieval service, default to CPU cores.",
        default=os.cpu_count() or 1,
    )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_ENGINE_OPTIONS(self) -> dict[str, Any]:
        # Parse DB_EXTRAS for 'options'
        db_extras_dict = dict(parse_qsl(self.DB_EXTRAS))
        options = db_extras_dict.get("options", "")
        # Always include timezone
        timezone_opt = "-c timezone=UTC"
        if options:
            # Merge user options and timezone
            merged_options = f"{options} {timezone_opt}"
        else:
            merged_options = timezone_opt

        connect_args = {"options": merged_options}

        return {
            "pool_size": self.SQLALCHEMY_POOL_SIZE,
            "max_overflow": self.SQLALCHEMY_MAX_OVERFLOW,
            "pool_recycle": self.SQLALCHEMY_POOL_RECYCLE,
            "pool_pre_ping": self.SQLALCHEMY_POOL_PRE_PING,
            "connect_args": connect_args,
            "pool_use_lifo": self.SQLALCHEMY_POOL_USE_LIFO,
            "pool_reset_on_return": None,
            "pool_timeout": self.SQLALCHEMY_POOL_TIMEOUT,
        }
