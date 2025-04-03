import { NotFoundException } from '@/core/api/exceptions';
import type { ChatSession } from '@/api/ai/model/chat-session.model';
import type { Query } from "@/core/api/commonModel";
import { ChatSessionRepository } from '@/api/ai/repo/chat-session.repository';

export class ChatSessionService {
	private repo: ChatSessionRepository;

	constructor(repository: ChatSessionRepository = new ChatSessionRepository()) {
		this.repo = repository;
	}

  async create(data: ChatSession) {
    data.status = 1;
    return await this.repo.create(data);
  }

  async update(data: ChatSession) {
    return await this.repo.update(data);
  }

	async get(id: string) {
		const doc = await this.repo.findById(id);
    if (!doc) {
      throw new NotFoundException('ChatSession', id.toString());
    }
    return doc;
	}

  async delete(id: string) {
    await this.repo.delete(id);
  }

  async getAll() {
    return this.repo.getAll()
  }

  async query(data: Query) {
    return this.repo.query(data)
  }
}

export const chatSessionService = new ChatSessionService();
