import { NoteService } from 'src/service/note';
import type { Note } from 'src/types/note';

/**
 * Local note service
 *
 * @version 1.0
 */
export class LocalNoteService implements NoteService {
  async saveNote (data: Indexable) {
    return new Promise<any>((resolve, reject) => {
      window.electronAPI.dbExecute('Note', 'save', data)
        .then((res: any) => {
          resolve(res);
        }).catch((err: any) => {
          reject(err);
        })
    });
  }

  /**
   * Get notes
   *
   * @param params {}
   */
  async getNotes (params: Indexable): Promise<Note[]> {
    return new Promise((resolve, reject) => {
      window.electronAPI.dbExecute('Note', 'find', params)
        .then((res: any) => {
          resolve(res as Note[]);
        }).catch((err: any) => {
        reject(err);
      })
    });
  }

  async getNote (id: string): Promise<Note | null> {
    return new Promise((resolve, reject) => {
      window.electronAPI.dbExecute('Note', 'findById', id)
        .then((res) => {
          resolve(res as Note);
        }).catch((err: any) => {
        reject(err);
      })
    });
  }

  async deleteNote (id: string) {
    return new Promise((resolve, reject) => {
      window.electronAPI.dbExecute('Note', 'deleteById', id)
        .then((res: any) => {
          resolve(res);
        }).catch((err: any) => {
        reject(err);
      })
    });
  }

  /**
   * Pagination query
   *
   * @param criteria
   */
  async queryNote (criteria: Indexable) {
    const query = {
      pageIndex: 1,
      pageSize: 20,
      condition: criteria
    };
    return new Promise((resolve, reject) => {
      window.electronAPI.dbExecute('Note', 'query', query)
        .then((res: any) => {
          resolve(res);
        }).catch((err: any) => {
        reject(err);
      })
    });
  }
}
