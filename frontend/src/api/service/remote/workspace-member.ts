/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, PUT, DELETE } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

export class WorkspaceMemberService extends BaseService {
  protected apiName = 'workspaceMember'

  async queryDetails(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query/details', body })
  }

}

export const workspaceMemberService = new WorkspaceMemberService()
