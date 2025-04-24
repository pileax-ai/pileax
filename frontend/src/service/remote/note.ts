import { NoteService } from 'src/service/note';
import { GET, POST, DELETE } from 'src/hooks/useRequest';
import { RemoteChatService } from 'src/service/remote/chat'

/**
 * Remote note service
 *
 * @version 1.0
 */
export class RemoteNoteService implements NoteService {
  private apiName = 'note';

  async save(data: Indexable): Promise<any> {
    return POST({ name: this.apiName, body: data });
  }

  async get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} });
  }

  async getAll(query: Indexable): Promise<any> {
    return GET({ name: this.apiName, path: '/all', query: query });
  }

  async delete(id: string) {
    return DELETE({ name: this.apiName, query: {id: id} });
  }

  /**
   * Pagination query
   *
   * @param query
   */
  async query(query: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query', body: query });
  }
}
