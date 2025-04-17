import OpenAI from 'openai';
import { logger } from '@/common';
import { BaseLLMProvider } from '@/ai/llm/base-llm-provider'
import { ChatMessage } from '@/types/chat'

export class DeepSeekLLM implements BaseLLMProvider{
  private sdk: any;
  private model: string;

  constructor(embedder = null, modelPreference = '') {
    this.initSdk();
    this.model = modelPreference || process.env.DEEPSEEK_MODEL_PREF
      || 'deepseek-chat';
    logger.info(`Initialized DeepSeek with model: ${this.model}`);
  }

  private initSdk() {
    logger.info(`Initialized DeepSeek with key: ${process.env.DEEPSEEK_API_KEY}`);
    this.sdk = new OpenAI({
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

  async createChatCompletion(messages: ChatMessage[], {
    temperature = 0.7,
    stream = true
  }) {
    const request = this.sdk.chat.completions.create({
      model: this.model,
      messages,
      temperature: temperature,
      stream: stream,
    })
    return request;
  }

  async getModels() {
    return this.sdk.models.list();
  }
}
