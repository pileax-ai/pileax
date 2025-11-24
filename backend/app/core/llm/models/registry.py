from collections import defaultdict

# Global factory：chat、cv、embedding...
MODEL_FACTORY = defaultdict(dict)


def register(model_type: str, names):
    """
    Register model
    model_type: "chat_model" | "cv_model" | ...
    names: str | [str]
    """
    if isinstance(names, str):
        names = [names]

    def decorator(cls):
        for n in names:
            MODEL_FACTORY[model_type][n] = cls
        return cls

    return decorator
