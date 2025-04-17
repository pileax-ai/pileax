import OpenAI from 'openai';
import { Ollama } from 'ollama';
import { logger } from '@/common';
import { BaseLLMProvider } from '@/ai/llm/base-llm-provider'
import { ChatMessage } from '@/types/chat'

export class OllamaLLM implements BaseLLMProvider{
  private sdk: any;
  private model: string;

  constructor(embedder = null, modelPreference = '') {
    this.initSdk();
    this.model = modelPreference || process.env.OLLAMA_MODEL
      || 'deepseek-chat';
    logger.info(`Initialized Ollama with model: ${this.model}`);
  }

  private initSdk() {
    logger.info(`Initialized Ollama with key: ${process.env.OLLAMA_API_KEY}`);

    const apiKey = process.env.OLLAMA_API_KEY;
    const basePath = process.env.OLLAMA_BASE_PATH;

    const headers = apiKey
      ? { Authorization: `Bearer ${apiKey}` }
      : {};

    this.sdk = new Ollama({
      host: basePath,
      headers: headers as Indexable
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
    const request = this.sdk.chat({
      model: this.model,
      messages,
      temperature: temperature,
      stream: stream,
    })
    return request;
  }

  async getModels() {
    return this.sdk.list();
  }
}
