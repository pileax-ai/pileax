import { NotFoundException, ServerException } from '@/core/api/exceptions';
import type { Chat } from '@/api/ai/model/chat.model';
import type { Query } from "@/core/api/commonModel";
import { ChatRepository } from '@/api/ai/repo/chat.repository';
import { getLLM } from '@/ai/helpers/llmHelper';
import { logger } from '@/common';
import { ChatMessage } from '@/types/chat'
import { ChatCompletion } from '@/api/ai/model/chat.model'

export class ChatService {
	private repo: ChatRepository;

	constructor(repository: ChatRepository = new ChatRepository()) {
		this.repo = repository;
	}

  async create(data: Chat) {
    return await this.repo.create(data);
  }

  async update(data: Chat) {
    return await this.repo.update(data);
  }

	async get(id: string) {
		const doc = await this.repo.findById(id);
    if (!doc) {
      throw new NotFoundException('Chat', id.toString());
    }
    return doc;
	}

  async findAll(sessionId: string) {
    return await this.repo.findAll(sessionId);
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }

  async query(data: Query) {
    return this.repo.query(data)
  }

  async chatCompletion(data: ChatCompletion) {
    try {
      const llm = await getLLM('deepseek', 'deepseek-chat');
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are an assistant. Please answer in [LANGUAGE].',
        },
        {
          role: 'user',
          content: data.message,
        },
      ];
      return await llm.createChatCompletion(messages, {
        stream: data.stream
      });
    } catch (err: any) {
      logger.error(err);
      throw new ServerException('ChatCompletion', err.message);
    }
  }
}

export const chatService = new ChatService();
