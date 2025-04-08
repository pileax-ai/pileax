import { userService as service} from '@/api/user/service/user.service';
import { BaseController } from '@/core/api/base.controller'
import { User } from '@/api/user/model/user.model'

class UserController extends BaseController<User> {
  constructor() {
    super(service);
  }
}

export const userController = new UserController();
