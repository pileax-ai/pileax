import { BaseService } from 'src/api/service/remote/base'

/**
 * Note Service
 *
 * @version 1.0
 */


export class NoteService extends BaseService {
  protected apiName = 'note'
}

export const noteService = new NoteService()

