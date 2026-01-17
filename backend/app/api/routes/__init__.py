import importlib

from fastapi import APIRouter

api_router = APIRouter()

EXT_NAMES = [
    "account_security",
    "app",
    "auth",
    "book",
    "book_annotation",
    "book_collection",
    "chat",
    "chat_conversation",
    "edge",
    "file_meta",
    "file_upload",
    "llm",
    "note",
    "provider",
    "provider_credential",
    "provider_default_model",
    "provider_model",
    "system",
    "tenant",
    "user",
    "user_book",
    "workspace",
    "workspace_book",
    "workspace_book_collection",
    "workspace_member",
]
EXT_MODULES = [f"{__name__}.{name}" for name in EXT_NAMES]

# Auto import all routers
# for module_info in pkgutil.iter_modules(__path__):
#    module_name = f"{__name__}.{module_info.name}"
for module_name in EXT_MODULES:
    module = importlib.import_module(module_name)

    if hasattr(module, "router"):
        api_router.include_router(module.router)
