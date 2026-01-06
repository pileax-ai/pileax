import inspect
import logging
import re
from functools import partial

from app.api.models.provider_default_model import ProviderDefaultModelCredential
from app.core.llm.services.tenant_llm_service import TenantLLMService

logger = logging.getLogger(__name__)


class LLMService:
    def __init__(self, model_config: ProviderDefaultModelCredential, **kwargs):
        self.mdl = TenantLLMService.model_instance(model_config)
        self.model_name = model_config.model_name
        self.is_tools = False
        self.langfuse = None
        self.verbose_tool_use = kwargs.get("verbose_tool_use")
        # self._init_langfuse()

    def _init_langfuse(self):
        from langfuse import Langfuse

        langfuse_keys = {}  # todo
        self.langfuse = None
        langfuse = Langfuse(public_key=langfuse_keys.public_key, secret_key=langfuse_keys.secret_key,
                            host=langfuse_keys.host)
        if langfuse.auth_check():
            self.langfuse = langfuse
            trace_id = self.langfuse.create_trace_id()
            self.trace_context = {"trace_id": trace_id}

    @staticmethod
    def _clean_param(chat_partial, **kwargs):
        func = chat_partial.func
        sig = inspect.signature(func)
        support_var_args = False
        allowed_params = set()

        for param in sig.parameters.values():
            if param.kind == inspect.Parameter.VAR_KEYWORD:
                support_var_args = True
            elif param.kind in (inspect.Parameter.POSITIONAL_OR_KEYWORD, inspect.Parameter.KEYWORD_ONLY):
                allowed_params.add(param.name)
        if support_var_args:
            return kwargs
        else:
            return {k: v for k, v in kwargs.items() if k in allowed_params}

    def chat(self, system: str, history: list, gen_conf: dict = {}, **kwargs) -> str:
        pass

    def chat_streamly(self, system: str, history: list, gen_conf: dict = {}, **kwargs):
        if self.langfuse:
            generation = self.langfuse.start_generation(trace_context=self.trace_context,
                                                        name="chat_streamly",
                                                        model=self.model_name,
                                                        input={"system": system, "history": history})

        ans = ""
        chat_partial = partial(self.mdl.chat_streamly, system, history, gen_conf)
        total_tokens = 0
        if self.is_tools and self.mdl.is_tools:
            chat_partial = partial(self.mdl.chat_streamly_with_tools, system, history, gen_conf)
        use_kwargs = self._clean_param(chat_partial, **kwargs)
        for delta_ans in chat_partial(**use_kwargs):
            if isinstance(delta_ans, int):
                total_tokens = delta_ans
                if self.langfuse:
                    generation.update(output={"output": ans})
                    generation.end()
                break

            if delta_ans.endswith("</think>"):
                ans = ans[: -len("</think>")]

            if not self.verbose_tool_use:
                delta_ans = re.sub(r"<tool_call>.*?</tool_call>", "", delta_ans, flags=re.DOTALL)

            ans += delta_ans
            yield delta_ans, ans

        if total_tokens > 0:
            logger.info("Total tokens: %s", total_tokens)

        yield total_tokens, ans
