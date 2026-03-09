from datetime import UTC, datetime, timedelta

import jwt
from fastapi import HTTPException, status

from app.configs import app_config

ALGORITHM = "HS256"


class JWTService:
    def __init__(self):
        self.secret_key = app_config.SECRET_KEY

    def issue(self, payload: dict, token_type: str = "") -> str:
        typ = "JWT" if token_type == "" else f"JWT+{token_type.upper()}"
        headers = {
            "typ": typ,
        }
        return jwt.encode(payload, self.secret_key, algorithm=ALGORITHM, headers=headers)

    def issue_access_token(self, user_id: str) -> str:
        expires_delta = timedelta(minutes=app_config.ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.now(UTC) + expires_delta
        payload = {
            "sub": user_id,
            "exp": expire,
        }
        return self.issue(payload, token_type="access")

    def issue_collab_token(self, user_id: str) -> str:
        expires_delta = timedelta(days=app_config.COLLAB_TOKEN_EXPIRE_DAYS)
        expire = datetime.now(UTC) + expires_delta
        payload = {
            "sub": user_id,
            "exp": expire,
        }
        return self.issue(payload, token_type="collab")

    def issue_refresh_token(self, user_id: str) -> str:
        expires_delta = timedelta(days=app_config.REFRESH_TOKEN_EXPIRE_DAYS)
        expire = datetime.now(UTC) + expires_delta
        payload = {
            "sub": user_id,
            "exp": expire,
        }
        return self.issue(payload, token_type="refresh")

    def issue_csrf_token(self, user_id: str) -> str:
        expires_delta = timedelta(minutes=app_config.ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.now(UTC) + expires_delta
        payload = {
            "sub": user_id,
            "exp": expire,
        }
        return self.issue(payload, token_type="csrf")

    def decode(self, token) -> dict:
        try:
            return jwt.decode(token, self.secret_key, algorithms=[ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired.",
            )
        except jwt.InvalidSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token signature.",
            )
        except jwt.DecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Malformed token.",
            )
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not validate credentials.",
            )

    def decode_by_type(self, token: str, token_type: str = "") -> dict:
        expected_type = "JWT" if token_type == "" else f"JWT+{token_type.upper()}"
        header = jwt.get_unverified_header(token)
        if header.get("typ") != expected_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token type mismatch.",
            )
        return self.decode(token)
