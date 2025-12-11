/**
 * Remote book annotation service
 *
 * @version 1.0
 */
import { GET, POST } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

export class BookAnnotationService extends BaseService {
  protected apiName = 'bookAnnotation';

  /**
   * Query, left join with book
   * @param query
   */
  async queryBook(query: Indexable): Promise<any> {
    return POST({ name: 'bookAnnotation', path: '/query/details', body: query });
  }
}

export const bookAnnotationService = new BookAnnotationService();
