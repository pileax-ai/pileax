/**
 * Remote service
 *
 * @version 1.0
 */
import { GET } from 'src/hooks/useRequest'

export class ProviderModelService {
  private apiName = 'providerModel'

  getAll(): Promise<any> {
    return GET({ name: this.apiName, path: '/all' })
  }

  findByType(type: string): Promise<any> {
    const query = { model_type: type }
    return GET({ name: this.apiName, path: '/by-type', query })
  }

}

export const providerModelService = new ProviderModelService()
