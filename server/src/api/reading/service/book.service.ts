import { NotFoundException } from '@/core/api/exceptions';
import type { Book } from '@/api/reading/model/book.model';
import type { Query } from "@/core/api/commonModel";
import { BookRepository } from '@/api/reading/repo/book.repository';

export class BookService {
	private repo: BookRepository;

	constructor(repository: BookRepository = new BookRepository()) {
		this.repo = repository;
	}

  async create(data: Book) {
    return await this.repo.create(data);
  }

  async update(data: Book) {
    return await this.repo.update(data);
  }

	async get(id: string) {
		const doc = await this.repo.findById(id);
    if (!doc) {
      throw new NotFoundException('Book', id.toString());
    }
    return doc;
	}

  async getByUuid(uuid: string) {
    const doc = await this.repo.findByUuid(uuid);
    if (!doc) {
      throw new NotFoundException('Book', uuid);
    }
    return doc;
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }

  async getAll() {
    return this.repo.getAll()
  }

  async query(data: Query) {
    return this.repo.query(data)
  }
}

export const bookService = new BookService();
