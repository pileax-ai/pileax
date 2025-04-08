import { NotFoundException } from '@/core/api/exceptions';
import type { Book } from '@/api/reading/model/book.model';
import { BookRepository } from '@/api/reading/repo/book.repository';
import { BaseService } from '@/core/api/base.service'

export class BookService extends BaseService<Book, BookRepository> {

	constructor() {
		super(new BookRepository());
	}

  async getByUuid(uuid: string) {
    const doc = await this.repo.findByUuid(uuid);
    if (!doc) {
      throw new NotFoundException('Book', uuid);
    }
    return doc;
  }

}

export const bookService = new BookService();
