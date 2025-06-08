/**
 * Remote auth service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest';

export class RemoteAuthService {
  private apiName = 'auth';

  async autoSignin(): Promise<any> {
    const formData = new FormData();
    formData.append('username', 'username');
    formData.append('password', 'password');

    return POST({
      name: this.apiName,
      path: '/signin',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }

}

export const authService = new RemoteAuthService();
