/**
 * Remote service
 *
 * @version 1.0
 */
import { BaseService } from 'src/api/service/remote/base'

export class UserService extends BaseService {
  protected apiName = 'user';
}

export const userService = new UserService();
