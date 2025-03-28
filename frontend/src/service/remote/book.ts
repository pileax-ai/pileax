/**
 * Remote book service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';
import { Book } from 'app/src-electron/db/entity'

export class RemoteBookService {

  async saveBook(data: Indexable): Promise<any> {
    return POST({ name: 'book', body: data });
  }

  async getBooks(params: Indexable): Promise<any> {
    return GET({ name: 'book', path: '/all' });
  }

  async getBook(id: string): Promise<any> {
    return GET({ name: 'book', query: {id: id} });
  }

  async getBookByUuid(uuid: string): Promise<any> {
    return GET({ name: 'book', path: '/uuid',  query: {uuid: uuid} });
  }

  async deleteBook(id: string) {
    return DELETE({ name: 'book', query: {id: id} });
  }

  /**
   * Pagination query
   *
   * @param criteria
   */
  async queryBook(criteria: Indexable): Promise<any> {
    const body = {
      pageIndex: 1,
      pageSize: 20,
      condition: criteria
    };
    return POST({ name: 'book', path: '/query', body: body });
  }
}

export const bookService = new RemoteBookService();
