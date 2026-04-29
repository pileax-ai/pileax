from typing import Any

from fastapi import HTTPException
from starlette.responses import StreamingResponse

from app.api.deps import CommonHeaders
from app.api.models.llm_message import LLMMessage, LLMTTSMessage, TTSOptions
from app.api.models.provider_default_model import ProviderDefaultModelCredential
from app.api.services.prompt_service import PromptService
from app.api.services.provider_credential_service import ProviderCredentialService
from app.api.services.provider_default_model_service import ProviderDefaultModelService
from app.constants.enums import LLMType
from app.core.llm.services.llm_service import LLMService


class TTSService:
    def __init__(self, session, user_id, workspace):
        self.user_id = user_id
        self.workspace = workspace
        self.prompt_service = PromptService(session, user_id, workspace)
        self.pdm_service = ProviderDefaultModelService(session, user_id, workspace.id)
        self.pc_service = ProviderCredentialService(session)

    def tts_llm(self, item_in: LLMTTSMessage, headers: CommonHeaders) -> Any:
        return self._tts(item_in, headers)

    def _tts(self, item_in: LLMTTSMessage, headers: CommonHeaders) -> Any:
        pdm_credential = None

        # user specific model
        if item_in.model_provider:
            provider_credential = self.pc_service.find_one(
                {
                    "workspace_id": self.workspace.id,
                    "provider": item_in.model_provider,
                }
            )
            if provider_credential:
                pdm_credential = ProviderDefaultModelCredential(
                    provider=provider_credential.provider,
                    model_name=item_in.model_name,
                    model_type=item_in.model_type,
                    credential=provider_credential.credential,
                )

        # default model
        if pdm_credential is None:
            pdm_credential = self.pdm_service.get_default_model_credential(self.workspace.id, LLMType.TTS)

        if pdm_credential is None:
            raise HTTPException(
                status_code=400, detail=f"Credential for {item_in.model_provider} has not been configured yet."
            )

        # decrypt api_key
        credential = self.pc_service.decrypt(pdm_credential.credential, self.workspace)
        pdm_credential.credential = credential

        # Audio generator
        llm_service = LLMService(pdm_credential)
        options = TTSOptions(**item_in.model_dump())
        audio_generator = llm_service.tts(item_in.message, **options.model_dump())

        def stream_wrapper():
            try:
                for chunk in audio_generator:
                    if isinstance(chunk, bytes):
                        yield chunk
            except Exception as e:
                # In binary stream, we can't easily yield an error message mid-stream
                # without corrupting the file, but we log it.
                raise HTTPException(
                    status_code=500, detail=f"TTS Streaming Error: {str(e)}"
                )

        return StreamingResponse(
            stream_wrapper(),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline",  # Tell browser play directly
                "Cache-Control": "no-cache",
            },
        )
