import { BaseService } from 'src/api/service/remote/base'
import { GET } from 'src/hooks/useRequest'

/**
 * NoteShare Service
 *
 * @version 1.0
 */


export class NoteShareService extends BaseService {
  protected apiName = 'noteShare'

  getByNote(noteId: string): Promise<any> {
    const query = {
      note_id: noteId
    }
    return GET({ name: this.apiName, path: '/by-note', query })
  }

  getDetails(shareId: string): Promise<any> {
    const query = {
      share_id: shareId
    }
    return GET({ name: this.apiName, path: '/details', query })
  }
}

export const noteShareService = new NoteShareService()

