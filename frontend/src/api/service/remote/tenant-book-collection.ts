/**
 * Remote Tenant book collection service
 *
 * @version 1.0
 */
import { BaseService } from 'src/api/service/remote/base'

export class TenantBookCollectionService extends BaseService {
  protected apiName = 'tenantBookCollection';
}

export const tenantBookCollectionService = new TenantBookCollectionService();
