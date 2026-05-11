from typing import Any

from fastapi import Depends

from app.api.controllers.system_setting_controller import SystemSettingController
from app.api.models.system_setting import SystemSettingItem, SystemSettingPublic
from app.api.router import ApiRouter

router = ApiRouter(prefix="/system/setting", tags=["System Setting"])


@router.api_get("/settings", response_model=SystemSettingPublic)
async def get_settings(controller: SystemSettingController = Depends()) -> Any:
    return controller.get_settings()


@router.api_put("/item", response_model=SystemSettingItem)
async def update_setting_item(item_in: SystemSettingItem, controller: SystemSettingController = Depends()) -> Any:
    return controller.update_setting_item(item_in.key, item_in.value)
