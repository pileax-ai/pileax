import type { User } from '@/api/user/model/user.model';
import { UserRepository } from '@/api/user/repo/user.repository';
import { BaseService } from '@/core/api/base.service'

export class UserService extends BaseService<User, UserRepository> {

  constructor() {
    super(new UserRepository());
  }

}

export const userService = new UserService();
