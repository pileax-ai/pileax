/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';

export class RemoteChatSessionService {

  async save(data: Indexable): Promise<any> {
    return POST({ name: 'chatSession', body: data });
  }

  async getAll(query: Indexable): Promise<any> {
    return GET({ name: 'chatSession', path: '/all', query: query });
  }

  async get(id: string): Promise<any> {
    return GET({ name: 'chatSession', query: {id: id} });
  }

  async delete(id: string) {
    return DELETE({ name: 'chatSession', query: {id: id} });
  }

  /**
   * Pagination query
   *
   * @param query
   */
  async query(query: Indexable): Promise<any> {
    return POST({ name: 'chatSession', path: '/query', body: query });
  }

}

export const chatSessionService = new RemoteChatSessionService();
