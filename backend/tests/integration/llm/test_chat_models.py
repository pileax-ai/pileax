import os

from app.core.llm.models import ChatModel

provider = "DeepSeek"
model_name = "deepseek-chat"
deepseek_api_key = os.environ.get("DEEPSEEK_API_KEY", "")


def test_chat_model() -> None:
    model_cls = ChatModel["DeepSeek"]


def test_chat_model_litellm() -> None:
    extra = {"provider": provider}
    assert provider in ChatModel, f"Chat model from {provider} is not supported yet."
    model_cls = ChatModel[provider]
    model = model_cls(deepseek_api_key, model_name, base_url="", **extra)

    try:
        m, tc = model.chat(None, [{"role": "user", "content": "Hello! How are you doing!"}],
                                 {"temperature": 0.9, 'max_tokens': 50})
        print(f"success. {m} {tc}")
        if m.find("**ERROR**") >= 0:
            raise Exception(m)
    except Exception as e:
        print(f"\nFail to access model({provider}/{model_name}) using this api key." + str(e))
