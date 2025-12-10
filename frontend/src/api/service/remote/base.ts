/**
 * Remote base service
 *
 * @version 1.0
 */
import { GET, POST, PUT, DELETE } from 'src/hooks/useRequest';

export abstract class BaseService {
  protected abstract apiName: string;

  save(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, body });
  }

  update(body: Indexable): Promise<any> {
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

  getAll(book_id: string): Promise<any> {
    const query = {
      book_id
    }
    return GET({ name: this.apiName, path: '/all', query });
  }

}
