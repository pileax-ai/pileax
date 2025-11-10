import jwt

from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status

from app.configs import app_config

ALGORITHM = "HS256"

class JWTService:
    def __init__(self):
        self.secret_key = app_config.SECRET_KEY

    def issue(self, payload: dict) -> str:
        return jwt.encode(payload, self.secret_key, algorithm=ALGORITHM)

    def issue_access_token(self, user_id: str) -> str:
        expires_delta = timedelta(minutes=app_config.ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.now(timezone.utc) + expires_delta
        payload = {
            "iss": "PileaX API",
            "sub": user_id,
            "exp": expire,
        }
        return self.issue(payload)

    def issue_refresh_token(self, user_id: str) -> str:
        expires_delta = timedelta(days=app_config.REFRESH_TOKEN_EXPIRE_DAYS)
        expire = datetime.now(timezone.utc) + expires_delta
        payload = {
            "sub": user_id,
            "exp": expire,
        }
        return self.issue(payload)

    def issue_csrf_token(self, user_id: str) -> str:
        expires_delta = timedelta(minutes=app_config.ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.now(timezone.utc) + expires_delta
        payload = {
            "sub": user_id,
            "exp": expire,
        }
        return self.issue(payload)

    def decode(self, token) -> dict:
        try:
            return jwt.decode(token, self.secret_key, algorithms=[ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token has expired.",
            )
        except jwt.InvalidSignatureError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token signature.",
            )
        except jwt.DecodeError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token.",
            )
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
