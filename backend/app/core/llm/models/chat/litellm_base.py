import json
import logging
import os
import random
import re
import time

import litellm

from app.core.nlp import is_chinese
from .base import Base, LENGTH_NOTIFICATION_CN, LENGTH_NOTIFICATION_EN, LLMErrorCode, ERROR_PREFIX
from ..registry import register
from ... import SupportedLiteLLMProvider, FACTORY_DEFAULT_BASE_URL, LITELLM_PROVIDER_PREFIX
from ...utils.token import total_token_count_from_response, num_tokens_from_string

logger = logging.getLogger(__name__)


FACTORY_NAMES = [
    "Tongyi-Qianwen",
    "Bedrock",
    "Moonshot",
    "xAI",
    "DeepInfra",
    "Groq",
    "Cohere",
    "Gemini",
    "DeepSeek",
    "NVIDIA",
    "TogetherAI",
    "Anthropic",
    "Ollama",
    "Meituan",
    "CometAPI",
    "SILICONFLOW",
    "OpenRouter",
    "StepFun",
    "PPIO",
    "PerfXCloud",
    "Upstage",
    "NovitaAI",
    "01.AI",
    "GiteeAI",
    "302.AI",
]


@register("chat", FACTORY_NAMES)
class LiteLLMBase(Base):
    def __init__(self, key, model_name, base_url=None, **kwargs):
        self.timeout = int(os.environ.get("LM_TIMEOUT_SECONDS", 600))
        self.provider = kwargs.get("provider", "")
        self.prefix = LITELLM_PROVIDER_PREFIX.get(self.provider, "")
        self.model_name = f"{self.prefix}{model_name}"
        self.api_key = key
        self.base_url = (base_url or FACTORY_DEFAULT_BASE_URL.get(self.provider, "")).rstrip("/")
        # Configure retry parameters
        self.max_retries = kwargs.get("max_retries", int(os.environ.get("LLM_MAX_RETRIES", 5)))
        self.base_delay = kwargs.get("retry_interval", float(os.environ.get("LLM_BASE_DELAY", 2.0)))
        self.max_rounds = kwargs.get("max_rounds", 5)
        self.is_tools = False
        self.tools = []
        self.toolcall_sessions = {}

        # Factory specific fields
        if self.provider == SupportedLiteLLMProvider.Bedrock:
            self.bedrock_ak = json.loads(key).get("bedrock_ak", "")
            self.bedrock_sk = json.loads(key).get("bedrock_sk", "")
            self.bedrock_region = json.loads(key).get("bedrock_region", "")
        elif self.provider == SupportedLiteLLMProvider.OpenRouter:
            self.api_key = json.loads(key).get("api_key", "")
            self.provider_order = json.loads(key).get("provider_order", "")


    def _get_delay(self):
        """Calculate retry delay time"""
        return self.base_delay * random.uniform(10, 150)

    def _classify_error(self, error):
        """Classify error based on error message content"""
        error_str = str(error).lower()

        keywords_mapping = [
            (["quota", "capacity", "credit", "billing", "balance", "欠费"], LLMErrorCode.ERROR_QUOTA),
            (["rate limit", "429", "tpm limit", "too many requests", "requests per minute"], LLMErrorCode.ERROR_RATE_LIMIT),
            (["auth", "key", "apikey", "401", "forbidden", "permission"], LLMErrorCode.ERROR_AUTHENTICATION),
            (["invalid", "bad request", "400", "format", "malformed", "parameter"], LLMErrorCode.ERROR_INVALID_REQUEST),
            (["server", "503", "502", "504", "500", "unavailable"], LLMErrorCode.ERROR_SERVER),
            (["timeout", "timed out"], LLMErrorCode.ERROR_TIMEOUT),
            (["connect", "network", "unreachable", "dns"], LLMErrorCode.ERROR_CONNECTION),
            (["filter", "content", "policy", "blocked", "safety", "inappropriate"], LLMErrorCode.ERROR_CONTENT_FILTER),
            (["model", "not found", "does not exist", "not available"], LLMErrorCode.ERROR_MODEL),
            (["max rounds"], LLMErrorCode.ERROR_MODEL),
        ]
        for words, code in keywords_mapping:
            if re.search("({})".format("|".join(words)), error_str):
                return code

        return LLMErrorCode.ERROR_GENERIC

    def _clean_conf(self, gen_conf):
        if "max_tokens" in gen_conf:
            del gen_conf["max_tokens"]
        return gen_conf

    def _construct_completion_args(self, history, stream: bool, tools: bool, **kwargs):
        completion_args = {
            "model": self.model_name,
            "messages": history,
            "api_key": self.api_key,
            "num_retries": self.max_retries,
            **kwargs,
        }
        if stream:
            completion_args.update(
                {
                    "stream": stream,
                }
            )
        if tools and self.tools:
            completion_args.update(
                {
                    "tools": self.tools,
                    "tool_choice": "auto",
                }
            )
        if self.provider in FACTORY_DEFAULT_BASE_URL:
            completion_args.update({"api_base": self.base_url})
        elif self.provider == SupportedLiteLLMProvider.Bedrock:
            completion_args.pop("api_key", None)
            completion_args.pop("api_base", None)
            completion_args.update(
                {
                    "aws_access_key_id": self.bedrock_ak,
                    "aws_secret_access_key": self.bedrock_sk,
                    "aws_region_name": self.bedrock_region,
                }
            )

        if self.provider == SupportedLiteLLMProvider.OpenRouter:
            if self.provider_order:
                def _to_order_list(x):
                    if x is None:
                        return []
                    if isinstance(x, str):
                        return [s.strip() for s in x.split(",") if s.strip()]
                    if isinstance(x, (list, tuple)):
                        return [str(s).strip() for s in x if str(s).strip()]
                    return []
                extra_body = {}
                provider_cfg = {}
                provider_order = _to_order_list(self.provider_order)
                provider_cfg["order"] = provider_order
                provider_cfg["allow_fallbacks"] = False
                extra_body["provider"] = provider_cfg
                completion_args.update({"extra_body": extra_body})
        return completion_args

    def _chat(self, history, gen_conf, **kwargs):
        # import litellm
        logger.info("[HISTORY]" + json.dumps(history, ensure_ascii=False, indent=2))
        if self.model_name.lower().find("qwen3") >= 0:
            kwargs["extra_body"] = {"enable_thinking": False}

        completion_args = self._construct_completion_args(history=history, stream=False, tools=False, **gen_conf)
        response = litellm.completion(
            **completion_args,
            drop_params=True,
            timeout=self.timeout,
        )
        # response = self.client.chat.completions.create(model=self.model_name, messages=history, **gen_conf, **kwargs)
        if any([not response.choices, not response.choices[0].message, not response.choices[0].message.content]):
            return "", 0
        ans = response.choices[0].message.content.strip()
        if response.choices[0].finish_reason == "length":
            ans = self._length_stop(ans)

        return ans, total_token_count_from_response(response)

    def _chat_streamly(self, history, gen_conf, **kwargs):
        import litellm
        logging.info("[HISTORY STREAMLY]" + json.dumps(history, ensure_ascii=False, indent=4))
        reasoning_start = False

        completion_args = self._construct_completion_args(history=history, stream=True, tools=False, **gen_conf)
        stop = kwargs.get("stop")
        if stop:
            completion_args["stop"] = stop
        response = litellm.completion(
            **completion_args,
            drop_params=True,
            timeout=self.timeout,
        )

        for resp in response:
            if not hasattr(resp, "choices") or not resp.choices:
                continue

            delta = resp.choices[0].delta
            if not hasattr(delta, "content") or delta.content is None:
                delta.content = ""

            if kwargs.get("with_reasoning", True) and hasattr(delta, "reasoning_content") and delta.reasoning_content:
                ans = ""
                if not reasoning_start:
                    reasoning_start = True
                    ans = "<think>"
                ans += delta.reasoning_content + "</think>"
            else:
                reasoning_start = False
                ans = delta.content

            tol = total_token_count_from_response(resp)
            if not tol:
                tol = num_tokens_from_string(delta.content)

            finish_reason = resp.choices[0].finish_reason if hasattr(resp.choices[0], "finish_reason") else ""
            if finish_reason == "length":
                if is_chinese(ans):
                    ans += LENGTH_NOTIFICATION_CN
                else:
                    ans += LENGTH_NOTIFICATION_EN

            yield ans, tol

    @property
    def _retryable_errors(self) -> set[str]:
        return {
            LLMErrorCode.ERROR_RATE_LIMIT,
            LLMErrorCode.ERROR_SERVER,
        }

    def _should_retry(self, error_code: str) -> bool:
        return error_code in self._retryable_errors

    def _exceptions(self, e, attempt) -> str | None:
        logging.exception("OpenAI chat_with_tools")
        # Classify the error
        error_code = self._classify_error(e)
        if attempt == self.max_retries:
            error_code = LLMErrorCode.ERROR_MAX_RETRIES

        if self._should_retry(error_code):
            delay = self._get_delay()
            logging.warning(f"Error: {error_code}. Retrying in {delay:.2f} seconds... (Attempt {attempt + 1}/{self.max_retries})")
            time.sleep(delay)
            return None

        return f"{ERROR_PREFIX}: {error_code} - {str(e)}"

    def chat(self, system, history, gen_conf={}, **kwargs):
        if system and history and history[0].get("role") != "system":
            history.insert(0, {"role": "system", "content": system})
        gen_conf = self._clean_conf(gen_conf)

        # Implement exponential backoff retry strategy
        for attempt in range(self.max_retries + 1):
            try:
                response = self._chat(history, gen_conf, **kwargs)
                return response
            except Exception as e:
                e = self._exceptions(e, attempt)
                if e:
                    return e, 0
        assert False, "Shouldn't be here."

    def chat_streamly(self, system, history, gen_conf: dict = {}, **kwargs):
        if system and history and history[0].get("role") != "system":
            history.insert(0, {"role": "system", "content": system})
        gen_conf = self._clean_conf(gen_conf)
        ans = ""
        total_tokens = 0
        try:
            for delta_ans, tol in self._chat_streamly(history, gen_conf, **kwargs):
                yield delta_ans
                total_tokens += tol
        except Exception as e:
            yield ans + "\n**ERROR**: " + str(e)

        yield total_tokens
