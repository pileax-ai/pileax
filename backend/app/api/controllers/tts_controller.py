from app.api.deps import CommonHeadersDep, CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.llm_message import LLMMessage, LLMTTSMessage
from app.api.services.tts_service import TTSService


class TTSController:
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace, headers: CommonHeadersDep):
        self.service = TTSService(session, user.id, workspace)
        self.headers = headers

    def tts_llm(self, item_in: LLMTTSMessage) -> LLMMessage:
        return self.service.tts_llm(item_in, self.headers)
