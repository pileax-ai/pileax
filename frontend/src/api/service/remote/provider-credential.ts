/**
 * Remote service
 *
 * @version 1.0
 */
import { BaseService } from 'src/api/service/remote/base'

export class ProviderCredentialService extends BaseService {
  protected apiName = 'providerCredential';
}

export const providerCredentialService = new ProviderCredentialService();
