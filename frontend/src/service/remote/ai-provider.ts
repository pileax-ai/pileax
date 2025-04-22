/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';

export class RemoteAiProviderService {
  private apiName = 'aiProvider';

  async save(data: Indexable): Promise<any> {
    return POST({ name: this.apiName, body: data });
  }

  async saveAll(data: Indexable[]): Promise<any> {
    return POST({ name: this.apiName, path: '/all', body: data });
  }

  async get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} });
  }

  async getAll(query: Indexable): Promise<any> {
    return GET({ name: this.apiName, path: '/all', query: query });
  }

  async delete(id: string) {
    return DELETE({ name: this.apiName, query: {id: id} });
  }

  async disable(provider: string) {
    return DELETE({ name: this.apiName, path: '/disable',
      query: {provider: provider} });
  }

  /**
   * Pagination query
   *
   * @param query
   */
  async query(query: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query', body: query });
  }

}

export const aiProviderService = new RemoteAiProviderService();
