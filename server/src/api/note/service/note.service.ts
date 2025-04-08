import type { Note } from '@/api/note/model/note.model';
import { NoteRepository } from '@/api/note/repo/note.repository';
import { BaseService } from '@/core/api/base.service'

export class NoteService extends BaseService<Note, NoteRepository>{

	constructor() {
		super(new NoteRepository());
	}

}

export const noteService = new NoteService();
