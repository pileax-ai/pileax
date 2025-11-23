/**
 * Remote service
 *
 * @version 1.0
 */
import { RemoteBaseService } from './base'
import { GET } from 'src/hooks/useRequest'

export class TenantDefaultModelService extends RemoteBaseService {
  protected apiName = 'tenantDefaultModel';

  findByType(type: string): Promise<any> {
    const query = { model_type: type }
    return GET({ name: this.apiName, path: '/by-type', query });
  }
}

export const tdmService = new TenantDefaultModelService();
