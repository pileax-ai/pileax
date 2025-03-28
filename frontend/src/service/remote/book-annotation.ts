/**
 * Remote book annotation service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';

export class RemoteBookAnnotationService {

  async save(data: Indexable): Promise<any> {
    return POST({ name: 'bookAnnotation', body: data });
  }

  async getAll(query: Indexable): Promise<any> {
    return GET({ name: 'bookAnnotation', path: '/all', query: query });
  }

  async get(id: string): Promise<any> {
    return GET({ name: 'bookAnnotation', query: {id: id} });
  }

  async getByUuid(uuid: string): Promise<any> {
    return GET({ name: 'bookAnnotation', path: '/uuid',  query: {uuid: uuid} });
  }

  async delete(id: string) {
    return DELETE({ name: 'bookAnnotation', query: {id: id} });
  }

  /**
   * Pagination query
   *
   * @param criteria
   */
  async query(criteria: Indexable): Promise<any> {
    const body = {
      pageIndex: 1,
      pageSize: 20,
      condition: criteria
    };
    return POST({ name: 'bookAnnotation', path: '/query', body: body });
  }

  /**
   * Query, left join with book
   * @param condition
   */
  async queryBook(condition: Indexable): Promise<any> {
    const body = {
      pageIndex: 1,
      pageSize: 20,
      condition: condition
    };
    return POST({ name: 'bookAnnotation', path: '/query/book', body: body });
  }
}

export const bookAnnotationService = new RemoteBookAnnotationService();
