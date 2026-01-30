import { BaseService } from 'src/api/service/remote/base'
import { POST } from 'src/hooks/useRequest'

/**
 * Note Service
 *
 * @version 1.0
 */


export class NoteService extends BaseService {
  protected apiName = 'note'

  duplicate(id: string): Promise<any> {
    return POST({ name: this.apiName, path: '/duplicate', query: { id } })
  }

}

export const noteService = new NoteService()

