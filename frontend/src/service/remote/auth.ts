/**
 * Remote auth service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';

export class RemoteAuthService {

  async autoSignin(): Promise<any> {
    const query = {
      phone: 'phone',
      password: 'password'
    }
    return POST({ name: 'auth', path: '/signib', query: query });
  }

}

export const authService = new RemoteAuthService();
