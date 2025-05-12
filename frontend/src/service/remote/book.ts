/**
 * Remote book service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';
import { Book } from 'app/src-electron/db/entity'

export class RemoteBookService {
  private apiName = 'book';

  async save(data: Indexable): Promise<any> {
    return POST({ name: this.apiName, body: data });
  }

  async getAll(params: Indexable): Promise<any> {
    return GET({ name: this.apiName, path: '/all' });
  }

  async get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} });
  }

  async getByUuid(uuid: string): Promise<any> {
    return GET({ name: this.apiName, path: '/uuid',  query: {uuid: uuid} });
  }

  async delete(id: string) {
    return DELETE({ name: this.apiName, query: {id: id} });
  }

  async query(query: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query', body: query });
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

export const bookService = new RemoteBookService();
