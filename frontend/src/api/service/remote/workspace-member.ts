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

  async acceptInvite(id: string): Promise<any> {
    return POST({ name: this.apiName, path: '/accept', query: { id } })
  }

  async enable(id: string): Promise<any> {
    return POST({ name: this.apiName, path: '/enable', query: { id } })
  }

  async disable(id: string): Promise<any> {
    return POST({ name: this.apiName, path: '/disable', query: { id } })
  }

  async assignRole(id: string, role: string): Promise<any> {
    return POST({ name: this.apiName, path: '/role', query: { id, role } })
  }

}

export const workspaceMemberService = new WorkspaceMemberService()
