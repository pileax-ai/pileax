import { NoteService } from 'src/service/note';

import { GET, POST, DELETE } from 'src/hooks/useRequest'
/**
 * Remote note service
 *
 * @version 1.0
 */
export class RemoteNoteService implements NoteService {

  async saveNote(data: Indexable): Promise<any> {
    return POST({ name: 'note', body: data });
  }

  async getNotes(params: Indexable): Promise<any> {
    return GET({ name: 'note', path: '/all' });
  }

  async getNote(id: string): Promise<any> {
    return GET({ name: 'note', query: {id: id} });
  }

  async deleteNote(id: string) {
    return DELETE({ name: 'note', query: {id: id} });
  }

  /**
   * Pagination query
   *
   * @param criteria
   */
  async queryNote(criteria: Indexable) {
    const body = {
      pageIndex: 1,
      pageSize: 20,
      condition: criteria
    };
    return POST({ name: 'note', path: '/query', body: body });
  }
}
