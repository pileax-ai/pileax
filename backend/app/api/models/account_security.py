from app.api.models.base import BaseApiModel


class ChangePassword(BaseApiModel):
    password: str
    new_password: str

