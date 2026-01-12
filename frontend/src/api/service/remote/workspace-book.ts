/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, PUT, DELETE } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

export class WorkspaceBookService extends BaseService {
  protected apiName = 'workspaceBook'

  async getDetails(id: string): Promise<any> {
    return GET({ name: this.apiName, path: '/details', query: {id: id} })
  }

  async getStats(): Promise<any> {
    return GET({ name: this.apiName, path: '/stats'})
  }

}

export const workspaceBookService = new WorkspaceBookService()
