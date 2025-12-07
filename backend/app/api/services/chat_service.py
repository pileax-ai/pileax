import json
import re
from typing import List, Any
from uuid import UUID

from app.api.models.enums import Status
from app.api.services.provider_model_service import ProviderDefaultModelService
from app.constants.enums import LLMType
from app.core.llm.services.llm_service import LLMService

from app.api.models.message import Message, MessageCreate
from app.api.repos.message_repository import MessageRepository
from app.api.services.base_service import BaseService
from starlette.responses import StreamingResponse


class ChatService(BaseService[Message]):
    def __init__(self, session, user_id, workspace_id):
        super().__init__(Message, session, MessageRepository)
        self.user_id = user_id
        self.workspace_id = workspace_id
        self.pdm_service = ProviderDefaultModelService(session, workspace_id, user_id)

    def completions(self, item_in: MessageCreate) -> Any:
        # default model
        pdm_credential = self.pdm_service.get_default_model_credential(self.workspace_id, LLMType.CHAT)

        # message
        messages = self.find_by_conversation(item_in.conversation_id)
        history = [
            { "role": 'system', "content": 'You are an assistant. Please answer in [LANGUAGE].' },
        ]
        for message in messages:
            history.append({"role": "user", "content": message.message})
            history.append({"role": "assistant", "content": message.content})
        history.append({"role": "user", "content": item_in.message})

        # Chat completions
        llm_service = LLMService(pdm_credential)
        generator = llm_service.chat_streamly(None, history, {"temperature": 0.9, 'max_tokens': 50})

        content = ""
        reasoning_content = ""
        total_tokens = 0
        result = Status.ACTIVE
        def sse_gen():
            nonlocal content, reasoning_content, total_tokens, result

            try:
                for delta_ans, ans in generator:
                    # End with total_tokens
                    if isinstance(delta_ans, int):
                        total_tokens = delta_ans
                        continue

                    # Prepare sse message
                    content_type = 'content'
                    if delta_ans.startswith("<think>") or delta_ans.endswith("</think>"):
                        content_type = 'reasoning'
                        delta_ans = re.sub(r"</?think>", "", delta_ans)
                        reasoning_content += delta_ans
                    else:
                        content += delta_ans
                    data = {
                        "type": content_type,
                        "content": delta_ans
                    }
                    yield f"data: {json.dumps(data)}\n\n"

                # Done
                yield "event: [DONE]\n"
            except Exception as e:
                result = Status.INACTIVE
                yield f"event: [ERROR] {str(e)}\n"

            # Save to db
            save_message()

        def save_message():
            nonlocal content, reasoning_content, total_tokens

            item = item_in.model_dump(by_alias=True)
            item["workspace_id"] = self.workspace_id
            item["model_provider"] = pdm_credential.provider
            item["model_type"] = pdm_credential.model_type
            item["model_name"] = pdm_credential.model_name
            item["content"] = content
            item["reasoning_content"] = reasoning_content
            item["total_tokens"] = total_tokens
            item["result"] = result
            self.save(Message(**item))

        return StreamingResponse(
            sse_gen(),
            media_type="text/event-stream; charset=utf-8",
        )

    def find_by_conversation(self, conversation_id: UUID) -> List[Message]:
        return super().find_all({'conversation_id': conversation_id})
