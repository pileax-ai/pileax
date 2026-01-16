import { GET, POST } from 'src/hooks/useRequest'
import { BaseService } from 'src/api/service/remote/base'

/**
 * Remote workspace service
 *
 * @version 1.0
 */
export class WorkspaceService extends BaseService {
  protected apiName = 'workspace'

  async getWorkspaces(): Promise<any> {
    return GET({
      name: this.apiName,
      path: '/workspaces'
    })
  }

  async getWorkspacesDetails(): Promise<any> {
    return GET({
      name: this.apiName,
      path: '/workspaces/details'
    })
  }

}

export const workspaceService = new WorkspaceService()
