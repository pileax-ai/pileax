import { ServerException } from '@/core/api/exceptions';
import type { Chat } from '@/api/ai/model/chat.model';
import { ChatRepository } from '@/api/ai/repo/chat.repository';
import { getLLM } from '@/ai/helpers/llmHelper';
import { logger } from '@/common';
import { ChatMessage } from '@/types/chat';
import { ChatCompletion } from '@/api/ai/model/chat.model';
import { BaseService } from '@/core/api/base.service';

export class ChatService extends BaseService<Chat, ChatRepository>{

	constructor() {
		super(new ChatRepository());
	}

  async findBySession(sessionId: string) {
    return await this.repo.findBySession(sessionId);
  }

  async chatCompletion(data: ChatCompletion) {
    try {
      const chats = await this.findBySession(data.sessionId);
      const history = chats.flatMap((chat) => [
        { role: 'user', content: chat.message },
        { role: 'assistant', content: chat.content },
      ]);
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are an assistant. Please answer in [LANGUAGE].',
        },
        ...history,
        {
          role: 'user',
          content: data.message,
        },
      ];

      const provider = data.provider || 'deepseek';
      const model = data.model || '';
      const llm = await getLLM(provider, model);
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
