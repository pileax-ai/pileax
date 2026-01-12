/**
 * Remote Workspace book collection service
 *
 * @version 1.0
 */
import { BaseService } from 'src/api/service/remote/base'

export class WorkspaceBookCollectionService extends BaseService {
  protected apiName = 'workspaceBookCollection'
}

export const workspaceBookCollectionService = new WorkspaceBookCollectionService()
