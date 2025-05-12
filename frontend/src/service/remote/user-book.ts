/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';

export class RemoteUserBookService {
  private apiName = 'userBook';

  async save(data: Indexable): Promise<any> {
    return POST({ name: this.apiName, body: data });
  }

  async get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} });
  }

  async getDetails(id: string): Promise<any> {
    return GET({ name: this.apiName, path: '/details', query: {id: id} });
  }

  async delete(id: string) {
    return DELETE({ name: this.apiName, query: {id: id} });
  }

  async query(query: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query', body: query });
  }

  async queryDetails(query: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query/details', body: query });
  }

}

export const userBookService = new RemoteUserBookService();
