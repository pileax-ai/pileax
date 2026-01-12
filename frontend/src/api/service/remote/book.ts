/**
 * Remote book service
 *
 * @version 1.0
 */
import { GET, POST } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

export class BookService extends BaseService {
  protected apiName = 'book'

  getByUuid(uuid: string): Promise<any> {
    return GET({ name: this.apiName, path: '/uuid',  query: {uuid: uuid} })
  }


  getDetails(id: string): Promise<any> {
    return GET({ name: this.apiName, path: '/details', query: {id: id} })
  }

  upload(file: File, cover: File, book: Indexable): Promise<any> {
    const formData = new FormData()
    formData.append('files', file)
    formData.append('files', cover)
    formData.append('book', JSON.stringify(book))
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

  queryLibrary(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query/library', body })
  }
}

export const bookService = new BookService()
