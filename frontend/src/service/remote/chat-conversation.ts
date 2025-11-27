/**
 * Remote service
 *
 * @version 1.0
 */
import { RemoteBaseService } from 'src/service/remote/base'

export class RemoteChatConversationService extends RemoteBaseService {
  protected apiName = 'chatConversation';

}

export const chatConversationService = new RemoteChatConversationService();
