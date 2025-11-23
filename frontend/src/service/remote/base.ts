/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, PUT, DELETE } from 'src/hooks/useRequest';

export abstract class RemoteBaseService {
  protected abstract apiName: string;

  save(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, body });
  }

  put(body: Indexable): Promise<any> {
    return PUT({ name: this.apiName, body });
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

  findAll(): Promise<any> {
    return GET({ name: this.apiName, path: '/all' });
  }

}
