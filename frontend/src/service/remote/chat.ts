/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST } from 'src/hooks/useRequest';
import { RemoteBaseService } from 'src/service/remote/base'

export class RemoteChatService extends RemoteBaseService {
  protected apiName = 'chat';

  /**
   * completion
   */
  completion(data: Indexable): Promise<any> {
    return POST({ name: 'chat', path: '/completions', body: data });
  }

  /**
   * Get chat messages
   * @param id Conversation Id
   */
  getMessages(id: string): Promise<any> {
    const query = {
      conversation_id: id
    }
    return GET({ name: 'chat', path: '/messages', query });
  }

}

export const chatService = new RemoteChatService();
