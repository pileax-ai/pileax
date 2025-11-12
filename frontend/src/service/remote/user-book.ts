/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, PUT, DELETE } from 'src/hooks/useRequest';

export class RemoteUserBookService {
  private apiName = 'tenantBook';

  async save(data: Indexable): Promise<any> {
    return POST({ name: this.apiName, body: data });
  }

  async update(data: Indexable): Promise<any> {
    return PUT({ name: this.apiName, body: data });
  }

  async updateReadingProgress(data: Indexable): Promise<any> {
    return PUT({ name: this.apiName, path: '/reading/progress', body: data });
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

  async getStats(): Promise<any> {
    return GET({ name: this.apiName, path: '/stats'});
  }

}

export const userBookService = new RemoteUserBookService();
