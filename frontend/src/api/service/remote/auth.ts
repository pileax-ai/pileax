/**
 * Remote auth service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest'

export class RemoteAuthService {
  private apiName = 'auth'

  async signup(body: Indexable): Promise<any> {
    return POST({
      name: this.apiName,
      path: '/signup',
      body,
      withCredentials: true
    })
  }

  async signin(params: Indexable): Promise<any> {
    const formData = new FormData()
    formData.append('username', params.username)
    formData.append('password', params.password)

    return POST({
      name: this.apiName,
      path: '/signin',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true
    })
  }

  signout(): Promise<any> {
    return POST({
      name: this.apiName,
      path: '/signout',
      withCredentials: true
    })
  }

  refreshToken(): Promise<any> {
    return POST({
      name: this.apiName,
      path: '/refresh-token',
      withCredentials: true
    })
  }

}

export const authService = new RemoteAuthService()
