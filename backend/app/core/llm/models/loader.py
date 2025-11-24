import importlib
import pkgutil

def load_models(package):
    """
    Auto import all modules under package, prepare for registration
    """
    for _, module_name, _ in pkgutil.iter_modules(package.__path__):
        importlib.import_module(f"{package.__name__}.{module_name}")
