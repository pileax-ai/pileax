import type { Note } from 'src/types/note';
import { RemoteNoteService } from 'src/service/remote/note';

/**
 * Note Service
 *
 * @version 1.0
 */
export interface NoteService {
  getNotes(params: Indexable): Promise<Note[]>;
  getNote(id: string): Promise<Note | null>;
  saveNote(note: Indexable): Promise<Note | null>;
  queryNote(criteria: Indexable): Promise<unknown>;
  deleteNote(id: string): Promise<unknown>;
}

export {
  RemoteNoteService
}
