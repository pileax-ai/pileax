import { logger } from '@/common';
import { BaseLLMProvider } from '@/ai/llm/base-llm-provider'

export class DeepSeekLLM implements BaseLLMProvider{
  private sdk: any;
  private model: string;

  constructor(embedder = null, modelPreference = null) {
    this.initSdk().catch(console.error);
    this.model = modelPreference || process.env.DEEPSEEK_MODEL_PREF
      || 'deepseek-chat';
    logger.info('Initialized DeepSeek with model:', this.model);
  }

  private async initSdk() {
    const OpenAI = await import('openai');
    this.sdk = new OpenAI.default({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1',
    })
  }

  buildPrompt({
    systemPrompt = '',
    contextTexts = [],
    chatHistory = [],
    userPrompt = '',
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}`,
    };
    return [prompt, ...chatHistory, { role: "user", content: userPrompt }];
  }

  async streamChatCompletion(messages = null, {
    temperature = 0.7
  }) {
    const request = this.sdk.chat.completions.create({
      model: this.model,
      messages,
      temperature: temperature,
      stream: true,
    })
    return request;
  }
}
