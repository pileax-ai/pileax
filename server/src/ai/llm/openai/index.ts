import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { logger } from '@/common';
import { BaseLLMProvider } from '@/ai/llm/base-llm-provider'
import { ChatMessage } from '@/types/chat'

export class OpenAILLM implements BaseLLMProvider{
  private sdk: any;
  private model: string;

  constructor(embedder = null, modelPreference = '') {
    this.initSdk();
    this.model = modelPreference || process.env.OPENAI_MODEL_PREF
      || 'deepseek-chat';
    logger.info(`Initialized OpenAI with model: ${this.model}`);
  }

  private initSdk() {
    logger.info(`Initialized OpenAI with key: ${process.env.OPENAI_API_KEY}`);
    const proxy = process.env.HTTPS_PROXY || 'http://127.0.0.1:7890';
    this.sdk = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.openai.com/v1',
      httpAgent: new HttpsProxyAgent(proxy),
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
