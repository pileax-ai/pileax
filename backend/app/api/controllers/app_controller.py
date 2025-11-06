from typing import Optional

from app.api.controllers.base_controller import BaseController
from app.api.models.app import App, AppCreate, AppUpdate

class AppController(BaseController[App, AppCreate, AppUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(App, session, user_id)
