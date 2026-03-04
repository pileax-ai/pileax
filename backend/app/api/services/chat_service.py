import json
import re
from typing import Any
from uuid import UUID

from fastapi import HTTPException
from starlette.responses import StreamingResponse

from app.api.deps import CommonHeaders
from app.api.models.conversation import Conversation, ConversationCreate
from app.api.models.enums import Status
from app.api.models.message import Message, MessageCreate, NoteMessageCreate
from app.api.models.provider_default_model import ProviderDefaultModelCredential
from app.api.repos.message_repository import MessageRepository
from app.api.services.base_service import BaseService
from app.api.services.conversation_service import ConversationService
from app.api.services.prompt_service import PromptService
from app.api.services.provider_credential_service import ProviderCredentialService
from app.api.services.provider_default_model_service import ProviderDefaultModelService
from app.constants.enums import LLMType
from app.core.llm.services.llm_service import LLMService


class ChatService(BaseService[Message]):
    def __init__(self, session, user_id, workspace):
        super().__init__(Message, session, MessageRepository)
        self.user_id = user_id
        self.workspace = workspace
        self.conversation_service = ConversationService(session, user_id, workspace)
        self.prompt_service = PromptService(session, user_id, workspace)
        self.pdm_service = ProviderDefaultModelService(session, user_id, workspace.id)
        self.pc_service = ProviderCredentialService(session)

    def completions(self, item_in: MessageCreate, headers: CommonHeaders) -> Any:
        conversation = self.conversation_service.get(item_in.conversation_id)

        return self._completions(item_in, conversation, headers)

    def note_completions(self, item_in: NoteMessageCreate, headers: CommonHeaders) -> Any:
        conversation = self.conversation_service.get(item_in.conversation_id, raise_exception=False)
        if conversation is None:
            conversation = self.conversation_service.save(
                ConversationCreate(
                    id=item_in.conversation_id,
                    name=item_in.message,
                    model_provider=item_in.model_provider,
                    model_name=item_in.model_name,
                    model_type=item_in.model_type,
                    ref_id=item_in.ref_id,
                    ref_type=item_in.ref_type,
                )
            )

        return self._completions(item_in, conversation, headers)

    def find_by_conversation(self, conversation_id: UUID) -> list[Message]:
        return super().find_all(
            {
                "conversation_id": conversation_id,
                "user_id": self.user_id,
            }
        )

    def _completions(self, item_in: MessageCreate, conversation: Conversation, headers: CommonHeaders) -> Any:
        pdm_credential = None

        # user specific model
        if item_in.model_provider:
            provider_credential = self.pc_service.find_one({"provider": item_in.model_provider})
            if provider_credential:
                pdm_credential = ProviderDefaultModelCredential(
                    provider=provider_credential.provider,
                    model_name=item_in.model_name,
                    model_type=item_in.model_type,
                    credential=provider_credential.credential,
                )
        # default model
        if pdm_credential is None:
            pdm_credential = self.pdm_service.get_default_model_credential(self.workspace.id, LLMType.CHAT)

        if pdm_credential is None:
            raise HTTPException(
                status_code=400, detail=f"Credential for {item_in.model_provider} has not been configured yet."
            )

        # Build history
        messages = self.find_by_conversation(item_in.conversation_id)
        history = self.prompt_service.build_system_prompt(conversation.ref_type, conversation.ref_id, headers.locale)

        # Do NOT include history in specific cases
        if conversation.ref_type not in ["note", "note-content"]:
            for message in messages:
                history.append({"role": "user", "content": message.message})
                history.append({"role": "assistant", "content": message.content})

        # Last message
        history.append({"role": "user", "content": item_in.message})

        # Chat completions
        llm_service = LLMService(pdm_credential)
        generator = llm_service.chat_streamly(None, history, {})

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
                    content_type = "content"
                    if delta_ans.startswith("<think>") or delta_ans.endswith("</think>"):
                        content_type = "reasoning"
                        delta_ans = re.sub(r"</?think>", "", delta_ans)
                        reasoning_content += delta_ans
                    else:
                        content += delta_ans
                    data = {"type": content_type, "content": delta_ans}
                    yield f"data: {json.dumps(data)}\n\n"

                # Done
                yield "event: [DONE]\n\n"
            except Exception as e:
                result = Status.INACTIVE
                yield f"event: [ERROR] {str(e)}\n\n"

            # Save to db and update conversation
            save_message()
            update_conversation()

        def save_message():
            nonlocal content, reasoning_content, total_tokens

            item = item_in.model_dump(by_alias=True)
            item["appId"] = conversation.app_id
            item["user_id"] = self.user_id
            item["workspace_id"] = self.workspace.id
            item["modelProvider"] = pdm_credential.provider
            item["modelType"] = pdm_credential.model_type
            item["modelName"] = pdm_credential.model_name
            item["content"] = content
            item["reasoning_content"] = reasoning_content
            item["total_tokens"] = total_tokens
            item["result"] = result
            self.save(Message(**item))

        def update_conversation():
            self.conversation_service.update(
                item_in.conversation_id,
                {
                    "model_provider": pdm_credential.provider,
                    "model_name": pdm_credential.model_name,
                    "model_type": pdm_credential.model_type,
                },
            )

        return StreamingResponse(
            sse_gen(),
            media_type="text/event-stream; charset=utf-8",
        )
