_litellm = None


class ImportHelper:
    """
    Lazy Import Helper
    """
    _modules = {}

    @staticmethod
    def get_module(module_name):
        if module_name not in ImportHelper._modules:
            try:
                import importlib
                ImportHelper._modules[module_name] = importlib.import_module(module_name)
            except ImportError as e:
                raise e
        return ImportHelper._modules[module_name]

    @staticmethod
    def get_litellm():
        return ImportHelper.get_module("litellm")

    @staticmethod
    def get_openai():
        return ImportHelper.get_module("openai")

    @staticmethod
    def get_openai_client():
        openai_module = ImportHelper.get_module("openai")
        return openai_module.OpenAI
