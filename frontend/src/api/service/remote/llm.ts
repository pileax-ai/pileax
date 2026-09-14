/**
 * Remote service
 *
 * @version 1.0
 */
import { BaseService } from 'src/api/service/remote/base'

export class RemoteLLMService extends BaseService {
  protected apiName = 'llm'
}

export const llmService = new RemoteLLMService()
