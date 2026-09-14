/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

export class RemoteLLMProviderService extends BaseService {
  protected apiName = 'llmProvider'

  async getProviders() {
    return GET({ name: this.apiName, path: '/providers' })
  }

  async updateProviders() {
    return POST({ name: this.apiName, path: '/update' })
  }

}

export const llmProviderService = new RemoteLLMProviderService()
