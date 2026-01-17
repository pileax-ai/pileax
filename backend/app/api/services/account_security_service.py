import base64

from fastapi import HTTPException

from app.api.models.account_security import ChangePassword
from app.api.models.user import User
from app.api.repos.user_repository import UserRepository
from app.api.services.base_service import BaseService
from app.api.services.user_service import UserService
from app.libs.password import compare_password, hash_password


class AccountSecurityService(BaseService[User]):
    def __init__(self, session, user: User):
        super().__init__(User, session, UserRepository)
        self.session = session
        self.user = user
        self.service = UserService(session)

    def change_password(self, data: ChangePassword):
        password_salt = self.user.password_salt
        if not compare_password(data.password, self.user.password, password_salt):
            raise HTTPException(status_code=403, detail="auth.account.security.password_incorrect")

        salt = base64.b64decode(password_salt.encode())
        password_hashed = hash_password(data.new_password, salt)
        new_password = base64.b64encode(password_hashed).decode()

        super().update(self.user.id, {'password': new_password})
