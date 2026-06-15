/**
 * Remote auth service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest'
import { ipcProvider, ipcService } from 'src/api/ipc'

export class RemoteAuthService {
  private apiName = 'auth'

  async getInit(): Promise<any> {
    return GET({ name: this.apiName, path: '/init' })
  }

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

  async refreshToken(): Promise<any> {
    if (ipcProvider === 'web') {
      return POST({
        name: this.apiName,
        path: '/refresh-token',
        withCredentials: true
      })
    } else {
      const refreshToken = await ipcService.secureGet('refreshToken')
      return POST({
        name: this.apiName,
        path: '/refresh-token',
        withCredentials: true,
        headers: {
          'X-Refresh-Token': refreshToken,
        },
      })
    }
  }

}

export const authService = new RemoteAuthService()
