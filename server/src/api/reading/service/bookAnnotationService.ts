import { NotFoundException } from '@/core/api/exceptions';
import type { BookAnnotation } from '@/api/reading/model/bookAnnotationModel';
import type { Query } from "@/core/api/commonModel";
import { BookAnnotationRepository } from '@/api/reading/repo/bookAnnotationRepository';

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

	async get(id: number) {
		const doc = await this.repo.findById(id);
    if (!doc) {
      throw new NotFoundException('BookAnnotation', id.toString());
    }
    return doc;
	}

  async delete(id: number) {
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
