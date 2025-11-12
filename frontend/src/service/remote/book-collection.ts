/**
 * Remote book collection service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';

export class RemoteBookCollectionService {
  private apiName = 'bookCollection';

  async save(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, body });
  }

  async get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} });
  }

  async delete(id: string) {
    return DELETE({ name: this.apiName, query: {id: id} });
  }

  async query(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query', body });
  }

  async getAll(): Promise<any> {
    return GET({ name: this.apiName, path: '/all' });
  }

  /**
   * Query, left join with book
   * @param body
   */
  async queryBook(body: Indexable): Promise<any> {
    return POST({ name: 'bookAnnotation', path: '/query/details', body });
  }
}

export const bookCollectionService = new RemoteBookCollectionService();
