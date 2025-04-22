import type { Signin } from '@/api/user/model/auth.model';
import { UserRepository } from '@/api/user/repo/user.repository';
import { JwtUtil } from '@/common/utils/jwtUtil';
import { DEFAULT_USER_ID } from '@/common/constants';
import { HttpException } from '@/core/api/exceptions';
import * as R from 'ramda';

export class AuthService {
  private repo: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.repo = repository;
  }

  async signin(data: Signin) {
    console.log('signin', data);
    if (process.env.APP_MODE === 'SINGLE') {
      const user = await this.repo.findById(DEFAULT_USER_ID);
      if (!user) {
        throw new HttpException(500, 'Server initialized incorrectly.');
      }
      const token = JwtUtil.sign({
        userId: user.id,
        name: user.name
      });
      const account = R.omit(['password', 'status'], user);
      return {
        account,
        token: `Bearer ${token}`
      };
    } else {
      return {};
    }
  }
}

export const authService = new AuthService();
