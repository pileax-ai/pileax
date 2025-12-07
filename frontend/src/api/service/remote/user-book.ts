/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, PUT, DELETE } from 'src/hooks/useRequest';
import { BaseService } from 'src/api/service/remote/base'

export class UserBookService extends BaseService {
  protected apiName = 'userBook';

  async updateReadingProgress(data: Indexable): Promise<any> {
    return PUT({ name: this.apiName, path: '/reading/progress', body: data });
  }

}

export const userBookService = new UserBookService();
