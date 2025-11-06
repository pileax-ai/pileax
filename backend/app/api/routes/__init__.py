import importlib
import pkgutil

from fastapi import APIRouter

api_router = APIRouter()

# Auto import all routers
for module_info in pkgutil.iter_modules(__path__):
    module_name = f"{__name__}.{module_info.name}"
    module = importlib.import_module(module_name)

    if hasattr(module, "router"):
        api_router.include_router(getattr(module, "router"))
