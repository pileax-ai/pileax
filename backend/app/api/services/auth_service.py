import base64
import secrets

from datetime import timedelta

from fastapi import HTTPException

from app.api.models.auth import Token, Signin, LoginUpdate
from app.api.models.common import Status
from app.api.models.user import User
from app.api.services.tenant_service import TenantService
from app.api.services.user_service import UserService
from app.libs.helper import TokenHelper, get_current_time
from app.libs.jwt_service import JWTService
from app.libs.password import compare_password, hash_password
from app.core import security
from app.core.config import settings


class AuthService:
    def __init__(self, session):
        self.service = UserService(session)
        self.session = session

    def signup(self, obj: User) -> User:
        if obj.password:
            # generate password salt
            salt = secrets.token_bytes(16)
            password_salt = base64.b64encode(salt).decode()

            # encrypt password with salt
            password_hashed = hash_password(obj.password, salt)
            obj.password = base64.b64encode(password_hashed).decode()
            obj.password_salt = password_salt

        # Create user
        obj.status = Status.ACTIVE
        user = self.service.create(obj)

        # Create default tenant
        TenantService(self.session).create_default(user)

        return user

    def signin(self, data: Signin) -> User:
        app_mode = settings.APP_MODE
        # query = select(User).where(User.email == email)
        # user = self.session.exec(query).first()
        user = self.session.query(User).filter_by(email=data.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Incorrect email or password.")

        if user.password is None or not compare_password(data.password, user.password, user.password_salt):
            raise HTTPException(status_code=403, detail="Incorrect email or password.")

        return user


    def login(self, user: User, ip: str | None = None) -> Token:
        item_in = LoginUpdate(last_login_ip=ip, last_login_time=get_current_time())
        self.service.update(user.id, item_in.model_dump(exclude_unset=True, exclude_none=True))

        return Token(
            access_token=JWTService().issue_access_token(user),
            refresh_token=TokenHelper.generate_refresh_token(),
            csrf_token=JWTService().issue_csrf_token(user),
        )


    @staticmethod
    def generate_jwt_token(self, user: User) -> Token:
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return Token(
            access_token=security.create_access_token(
                user.id,
                expires_delta=access_token_expires
            )
        )
