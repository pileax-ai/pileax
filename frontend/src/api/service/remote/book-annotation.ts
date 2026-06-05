/**
 * Remote book annotation service
 *
 * @version 1.0
 */
import { GET, POST } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

export class BookAnnotationService extends BaseService {
  protected apiName = 'bookAnnotation'

  /**
   * Query, left join with book
   * @param query
   */
  async queryBook(query: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query/details', body: query })
  }

  /**
   * Group by book
   */
  async groupByBook(keyword: string = ''): Promise<any> {
    return GET({ name: this.apiName, path: '/group/book', query: { keyword } })
  }
}

export const bookAnnotationService = new BookAnnotationService()
