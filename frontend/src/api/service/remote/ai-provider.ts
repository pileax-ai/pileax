/**
 * Remote service
 *
 * @version 1.0
 */
import { DELETE } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

export class AiProviderService extends BaseService {
  protected apiName = 'aiProvider'

  disable(provider: string) {
    return DELETE({ name: this.apiName, path: '/disable',
      query: {provider: provider} })
  }

}

export const aiProviderService = new AiProviderService()
