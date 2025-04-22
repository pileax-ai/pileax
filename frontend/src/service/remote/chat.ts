/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';

export class RemoteChatService {

  async save(data: Indexable): Promise<any> {
    return POST({ name: 'chat', body: data });
  }

  async getAll(query: Indexable): Promise<any> {
    return GET({ name: 'chat', path: '/all', query: query });
  }

  async get(id: string): Promise<any> {
    return GET({ name: 'chat', query: {id: id} });
  }

  async delete(id: string) {
    return DELETE({ name: 'chat', query: {id: id} });
  }

  /**
   * Pagination query
   *
   * @param query
   */
  async query(query: Indexable): Promise<any> {
    return POST({ name: 'chat', path: '/query', body: query });
  }

  /**
   * completion
   */
  async completion(data: Indexable): Promise<any> {
    return POST({ name: 'chat', path: '/completions', body: data });
  }

}

export const chatService = new RemoteChatService();
