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
   * @param query
   */
  async queryBook(query: Indexable): Promise<any> {
    return POST({ name: 'book', path: '/query', body: query });
  }

  async uploadBook(file: File, cover: File, book: Indexable) {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('files', cover);
    formData.append('book', JSON.stringify(book));
    return POST({
      name: 'book',
      path: '/upload',
      query: { uuid: book.uuid },
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }
}

export const bookService = new RemoteBookService();
