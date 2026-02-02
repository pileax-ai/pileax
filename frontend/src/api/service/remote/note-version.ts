import { BaseService } from 'src/api/service/remote/base'
import { POST } from 'src/hooks/useRequest'

/**
 * NoteVersion Service
 *
 * @version 1.0
 */


export class NoteVersionService extends BaseService {
  protected apiName = 'noteVersion'


  queryDetails(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query/details', body })
  }
}

export const noteVersionService = new NoteVersionService()

