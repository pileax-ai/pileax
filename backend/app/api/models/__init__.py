import importlib
import pkgutil

for module_info in pkgutil.iter_modules(__path__):
    module_name = f"{__name__}.{module_info.name}"
    importlib.import_module(module_name)
