import type { Note } from 'src/types/note';
import { RemoteNoteService } from 'src/service/remote/note';

/**
 * Note Service
 *
 * @version 1.0
 */
export interface NoteService {
  save(note: Indexable): Promise<Note | null>;
  getAll(query: Indexable): Promise<Note[]>;
  get(id: string): Promise<Note | null>;
  delete(id: string): Promise<unknown>;
  query(query: Indexable): Promise<unknown>;
}

const noteService = new RemoteNoteService();

export {
  noteService,
  RemoteNoteService
}
