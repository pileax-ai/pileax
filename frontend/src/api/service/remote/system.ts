/**
 * Remote system service
 *
 * @version 1.0
 */
import { GET } from 'src/hooks/useRequest'

export class RemoteSystemService {
  private apiName = 'system'

  healthCheck(): Promise<any> {
    return GET({
      name: this.apiName,
      path: '/health-check',
      withCredentials: true
    })
  }

}

export const systemService = new RemoteSystemService()
