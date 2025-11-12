/**
 * Remote Tenant book collection service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';

export class RemoteTenantBookCollectionService {
  private apiName = 'tenantBookCollection';

  save(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, body });
  }

  get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} });
  }

  delete(id: string) {
    return DELETE({ name: this.apiName, query: {id: id} });
  }

  query(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query', body });
  }

  getAll(): Promise<any> {
    return GET({ name: this.apiName, path: '/all' });
  }

  queryBook(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query/book/details', body });
  }

}

export const tenantBookCollectionService = new RemoteTenantBookCollectionService();
