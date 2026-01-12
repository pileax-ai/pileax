from enum import StrEnum


class SupportedLiteLLMProvider(StrEnum):
    Tongyi = "Tongyi"
    Dashscope = "Dashscope"
    Bedrock = "Bedrock"
    Moonshot = "Moonshot"
    xAI = "xAI"
    DeepInfra = "DeepInfra"
    Groq = "Groq"
    Cohere = "Cohere"
    Gemini = "Gemini"
    DeepSeek = "DeepSeek"
    Nvidia = "NVIDIA"
    TogetherAI = "TogetherAI"
    Anthropic = "Anthropic"
    Ollama = "Ollama"
    Meituan = "Meituan"
    CometAPI = "CometAPI"
    SILICONFLOW = "SILICONFLOW"
    OpenRouter = "OpenRouter"
    StepFun = "StepFun"
    PPIO = "PPIO"
    PerfXCloud = "PerfXCloud"
    Upstage = "Upstage"
    NovitaAI = "NovitaAI"
    Lingyi_AI = "01.AI"
    GiteeAI = "GiteeAI"
    AI_302 = "302.AI"


FACTORY_DEFAULT_BASE_URL = {
    SupportedLiteLLMProvider.Tongyi: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    SupportedLiteLLMProvider.Dashscope: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    SupportedLiteLLMProvider.Moonshot: "https://api.moonshot.cn/v1",
    SupportedLiteLLMProvider.Ollama: "",
    SupportedLiteLLMProvider.Meituan: "https://api.longcat.chat/openai",
    SupportedLiteLLMProvider.CometAPI: "https://api.cometapi.com/v1",
    SupportedLiteLLMProvider.SILICONFLOW: "https://api.siliconflow.cn/v1",
    SupportedLiteLLMProvider.OpenRouter: "https://openrouter.ai/api/v1",
    SupportedLiteLLMProvider.StepFun: "https://api.stepfun.com/v1",
    SupportedLiteLLMProvider.PPIO: "https://api.ppinfra.com/v3/openai",
    SupportedLiteLLMProvider.PerfXCloud: "https://cloud.perfxlab.cn/v1",
    SupportedLiteLLMProvider.Upstage: "https://api.upstage.ai/v1/solar",
    SupportedLiteLLMProvider.NovitaAI: "https://api.novita.ai/v3/openai",
    SupportedLiteLLMProvider.Lingyi_AI: "https://api.lingyiwanwu.com/v1",
    SupportedLiteLLMProvider.GiteeAI: "https://ai.gitee.com/v1/",
    SupportedLiteLLMProvider.AI_302: "https://api.302.ai/v1",
    SupportedLiteLLMProvider.Anthropic: "https://api.anthropic.com/",
}


LITELLM_PROVIDER_PREFIX = {
    SupportedLiteLLMProvider.Tongyi: "dashscope/",
    SupportedLiteLLMProvider.Dashscope: "dashscope/",
    SupportedLiteLLMProvider.Bedrock: "bedrock/",
    SupportedLiteLLMProvider.Moonshot: "moonshot/",
    SupportedLiteLLMProvider.xAI: "xai/",
    SupportedLiteLLMProvider.DeepInfra: "deepinfra/",
    SupportedLiteLLMProvider.Groq: "groq/",
    SupportedLiteLLMProvider.Cohere: "",  # don't need a prefix
    SupportedLiteLLMProvider.Gemini: "gemini/",
    SupportedLiteLLMProvider.DeepSeek: "deepseek/",
    SupportedLiteLLMProvider.Nvidia: "nvidia_nim/",
    SupportedLiteLLMProvider.TogetherAI: "together_ai/",
    SupportedLiteLLMProvider.Anthropic: "",  # don't need a prefix
    SupportedLiteLLMProvider.Ollama: "ollama_chat/",
    SupportedLiteLLMProvider.Meituan: "openai/",
    SupportedLiteLLMProvider.CometAPI: "openai/",
    SupportedLiteLLMProvider.SILICONFLOW: "openai/",
    SupportedLiteLLMProvider.OpenRouter: "openai/",
    SupportedLiteLLMProvider.StepFun: "openai/",
    SupportedLiteLLMProvider.PPIO: "openai/",
    SupportedLiteLLMProvider.PerfXCloud: "openai/",
    SupportedLiteLLMProvider.Upstage: "openai/",
    SupportedLiteLLMProvider.NovitaAI: "openai/",
    SupportedLiteLLMProvider.Lingyi_AI: "openai/",
    SupportedLiteLLMProvider.GiteeAI: "openai/",
    SupportedLiteLLMProvider.AI_302: "openai/",
}
