/**
 * Remote book collection service
 *
 * @version 1.0
 */
import { BaseService } from 'src/api/service/remote/base'

export class BookCollectionService extends BaseService {
  protected apiName = 'bookCollection';
}

export const bookCollectionService = new BookCollectionService();
