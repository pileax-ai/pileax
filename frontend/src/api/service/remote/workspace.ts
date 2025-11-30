import { GET, POST } from 'src/hooks/useRequest';

/**
 * Remote workspace service
 *
 * @version 1.0
 */
export class WorkspaceService {
  private apiName = 'workspace';

  async save(data: Indexable): Promise<any> {
    return POST({ name: this.apiName, body: data });
  }

  async getWorkspaces(): Promise<any> {
    return GET({
      name: this.apiName,
      path: '/workspaces'
    });
  }

}

export const workspaceService = new WorkspaceService();
