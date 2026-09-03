/**
 * Remote service
 *
 * @version 1.0
 */
import { BaseService } from 'src/api/service/remote/base'

export class RemoteWorkspaceLLMService extends BaseService {
  protected apiName = 'workspaceLLM'
}

export const workspaceLLMService = new RemoteWorkspaceLLMService()
