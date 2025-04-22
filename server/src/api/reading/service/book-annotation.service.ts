import type { BookAnnotation } from '@/api/reading/model/book-annotation.model';
import type { Query } from "@/core/api/commonModel";
import { BookAnnotationRepository } from '@/api/reading/repo/book-annotation.repository';
import { BaseService } from '@/core/api/base.service'

export class BookAnnotationService extends BaseService<BookAnnotation, BookAnnotationRepository> {

	constructor() {
		super(new BookAnnotationRepository());
	}

  async queryAll(query: Record<string, string>) {
    return this.repo.queryAll(query)
  }

  async queryBook(query: Query) {
    return this.repo.queryBook(query)
  }
}

export const bookAnnotationService = new BookAnnotationService();
