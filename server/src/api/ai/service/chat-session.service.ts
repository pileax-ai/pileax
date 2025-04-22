import type { ChatSession } from '@/api/ai/model/chat-session.model';
import { ChatSessionRepository } from '@/api/ai/repo/chat-session.repository';
import { BaseService } from '@/core/api/base.service'

export class ChatSessionService extends BaseService<ChatSession, ChatSessionRepository> {

	constructor() {
		super(new ChatSessionRepository());
	}

}

export const chatSessionService = new ChatSessionService();
