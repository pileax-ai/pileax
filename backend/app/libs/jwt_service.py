import jwt

from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status

from app.api.models.user import User
from app.core.config import settings

ALGORITHM = "HS256"

class JWTService:
    def __init__(self):
        self.secret_key = settings.SECRET_KEY

    def issue(self, payload: dict) -> str:
        return jwt.encode(payload, self.secret_key, algorithm=ALGORITHM)

    def issue_access_token(self, user: User) -> str:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.now(timezone.utc) + expires_delta
        payload = {
            "iss": "PileaX API",
            "sub": str(user.id),
            "exp": expire,
        }
        return self.issue(payload)

    def issue_csrf_token(self, user: User) -> str:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.now(timezone.utc) + expires_delta
        payload = {
            "sub": str(user.id),
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
