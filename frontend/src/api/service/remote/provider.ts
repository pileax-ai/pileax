/**
 * Remote service
 *
 * @version 1.0
 */
import { GET } from 'src/hooks/useRequest';
import { BaseService } from './base'

export class ProviderService extends BaseService {
  protected apiName = 'provider';

  override get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} });
  }

}

export const providerService = new ProviderService();
