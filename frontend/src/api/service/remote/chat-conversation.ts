/**
 * Remote service
 *
 * @version 1.0
 */
import { BaseService } from 'src/api/service/remote/base'

export class ChatConversationService extends BaseService {
  protected apiName = 'chatConversation';
}

export const chatConversationService = new ChatConversationService();
