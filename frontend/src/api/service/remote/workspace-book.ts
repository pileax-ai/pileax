/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, PUT, DELETE } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

export class WorkspaceBookService extends BaseService {
  protected apiName = 'workspaceBook'

  async getStats(): Promise<any> {
    return GET({ name: this.apiName, path: '/stats'})
  }

  async queryDetails(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query/details', body })
  }

  deletePermanent(id: string) {
    return DELETE({ name: this.apiName, path: '/permanent', query: {id: id} })
  }

}

export const workspaceBookService = new WorkspaceBookService()
