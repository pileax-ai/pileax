from app.core.llm.models import ChatModel


def test_chat_model() -> None:
    model_cls = ChatModel['DeepSeek']
    print(model_cls)
