import { NotFoundException } from '@/core/api/exceptions';
import type { BookAnnotation } from '@/api/reading/model/book-annotation.model';
import type { Query } from "@/core/api/commonModel";
import { BookAnnotationRepository } from '@/api/reading/repo/book-annotation.repository';

export class BookAnnotationService {
	private repo: BookAnnotationRepository;

	constructor(repository: BookAnnotationRepository = new BookAnnotationRepository()) {
		this.repo = repository;
	}

  async create(data: BookAnnotation) {
    return await this.repo.create(data);
  }

  async update(data: BookAnnotation) {
    return await this.repo.update(data);
  }

	async get(id: string) {
		const doc = await this.repo.findById(id);
    if (!doc) {
      throw new NotFoundException('BookAnnotation', id.toString());
    }
    return doc;
	}

  async delete(id: string) {
    await this.repo.delete(id);
  }

  async getAll(query: Record<string, string>) {
    return this.repo.getAll(query)
  }

  async query(query: Query) {
    return this.repo.query(query)
  }

  async queryBook(query: Query) {
    return this.repo.queryBook(query)
  }
}

export const bookAnnotationService = new BookAnnotationService();
