/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, PUT } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

export class RemoteChatService extends BaseService {
  protected apiName = 'chat';

  // override put(body: Indexable): Promise<any> {
  //   return PUT({ name: this.apiName, path: '/message', body });
  // }

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
