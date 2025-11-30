/**
 * Remote book service
 *
 * @version 1.0
 */
import { GET, POST } from 'src/hooks/useRequest';
import { BaseService } from 'src/api/service/remote/base'

export class BookService extends BaseService {
  protected apiName = 'book';

  async getByUuid(uuid: string): Promise<any> {
    return GET({ name: this.apiName, path: '/uuid',  query: {uuid: uuid} });
  }

  async upload(file: File, cover: File, book: Indexable) {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('files', cover);
    formData.append('book', JSON.stringify(book));
    return POST({
      name: this.apiName,
      path: '/upload',
      query: { uuid: book.uuid },
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }
}

export const bookService = new BookService();
