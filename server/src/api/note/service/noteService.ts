import { NotFoundException } from '@/core/api/exceptions';
import type { Note, NoteQuery } from '@/api/note/model/noteModel';
import { NoteRepository } from '@/api/note/repo/noteRepository';

export class NoteService {
	private repo: NoteRepository;

	constructor(repository: NoteRepository = new NoteRepository()) {
		this.repo = repository;
	}

  async create(data: Note) {
    return await this.repo.create(data);
  }

  async update(data: Note) {
    return await this.repo.update(data);
  }

	async get(id: string) {
		const doc = await this.repo.findById(id);
    if (!doc) {
      throw new NotFoundException('Note', id);
    }
    return doc;
	}

  async delete(id: string) {
    await this.repo.delete(id);
  }

  async getAll() {
    return this.repo.getAll()
  }

  async query(data: NoteQuery) {
    return this.repo.query(data)
  }
}

export const noteService = new NoteService();
