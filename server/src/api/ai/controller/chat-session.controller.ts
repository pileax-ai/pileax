import { chatSessionService as service } from '@/api/ai/service/chat-session.service';
import { BaseController } from '@/core/api/base.controller'
import { ChatSession } from '@/api/ai/model/chat-session.model'

class ChatSessionController extends BaseController<ChatSession> {
  constructor() {
    super(service);
  }
}

export const chatSessionController =
  new ChatSessionController();
