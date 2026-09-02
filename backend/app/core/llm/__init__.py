from enum import StrEnum


class SupportedLiteLLMProvider(StrEnum):
    Anthropic = "Anthropic"
    Bedrock = "Bedrock"
    Dashscope = "Dashscope"
    DeepSeek = "DeepSeek"
    Gemini = "Gemini"
    Groq = "Groq"
    HunYuan = "Tencent-Hy"
    Meituan = "Meituan"
    MiMo = "Xiaomi-MiMo"
    MiniMax = "MiniMax"
    Moonshot = "Moonshot"
    Ollama = "Ollama"
    OpenRouter = "OpenRouter"
    SiliconFlow = "SiliconFlow"
    Tongyi = "Tongyi"
    xAI = "xAI"
    Zhipu = "Zhipu"


FACTORY_DEFAULT_BASE_URL = {
    SupportedLiteLLMProvider.Anthropic: "https://api.anthropic.com/",
    SupportedLiteLLMProvider.Dashscope: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    SupportedLiteLLMProvider.DeepSeek: "https://api.deepseek.com",
    SupportedLiteLLMProvider.HunYuan: "https://api.hunyuan.cloud.tencent.com/v1",
    SupportedLiteLLMProvider.Meituan: "https://api.longcat.chat/openai",
    SupportedLiteLLMProvider.MiMo: "https://api.minimaxi.com/v1",
    SupportedLiteLLMProvider.MiniMax: "https://api.minimaxi.com/v1",
    SupportedLiteLLMProvider.Moonshot: "https://api.moonshot.cn/v1",
    SupportedLiteLLMProvider.Ollama: "",
    SupportedLiteLLMProvider.OpenRouter: "https://openrouter.ai/api/v1",
    SupportedLiteLLMProvider.SiliconFlow: "https://api.siliconflow.cn/v1",
    SupportedLiteLLMProvider.Tongyi: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    SupportedLiteLLMProvider.Zhipu: "https://open.bigmodel.cn/api/paas/v4",
}


LITELLM_PROVIDER_PREFIX = {
    SupportedLiteLLMProvider.Anthropic: "",  # don't need a prefix
    SupportedLiteLLMProvider.Bedrock: "bedrock/",
    SupportedLiteLLMProvider.Dashscope: "dashscope/",
    SupportedLiteLLMProvider.DeepSeek: "deepseek/",
    SupportedLiteLLMProvider.Gemini: "gemini/",
    SupportedLiteLLMProvider.Groq: "groq/",
    SupportedLiteLLMProvider.HunYuan: "openai/",
    SupportedLiteLLMProvider.Meituan: "openai/",
    SupportedLiteLLMProvider.MiniMax: "openai/", # todo
    SupportedLiteLLMProvider.Mimo: "xiaomi_mimo/",
    SupportedLiteLLMProvider.Moonshot: "moonshot/",
    SupportedLiteLLMProvider.Nvidia: "nvidia_nim/",
    SupportedLiteLLMProvider.Ollama: "ollama_chat/",
    SupportedLiteLLMProvider.OpenRouter: "openai/", # todo
    SupportedLiteLLMProvider.SiliconFlow: "openai/",
    SupportedLiteLLMProvider.Tongyi: "dashscope/",
    SupportedLiteLLMProvider.xAI: "xai/",
    SupportedLiteLLMProvider.Zhipu: "openai/",
}
