/**
 * Remote service
 *
 * @version 1.0
 */
import { BaseService } from './base'
import { GET } from 'src/hooks/useRequest'

export class WorkspaceDefaultModelService extends BaseService {
  protected apiName = 'workspaceDefaultModel';

  findByType(type: string): Promise<any> {
    const query = { model_type: type }
    return GET({ name: this.apiName, path: '/by-type', query });
  }
}

export const tdmService = new WorkspaceDefaultModelService();
