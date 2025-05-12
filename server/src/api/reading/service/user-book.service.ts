import type { UserBook } from '@/api/reading/model/user-book.model';
import type { Query } from "@/core/api/commonModel";
import { UserBookRepository } from '@/api/reading/repo/user-book.repository';
import { BaseService } from '@/core/api/base.service'
import { NotFoundException } from '@/core/api/exceptions'

export class UserBookService extends BaseService<UserBook, UserBookRepository> {

	constructor() {
		super(new UserBookRepository());
	}

  async getDetails(id: string) {
    const doc = await this.repo.findDetailsById(id);
    if (!doc) {
      throw new NotFoundException(this.constructor.name, id);
    }
    return doc;
  }

  async queryDetails(query: Query) {
    return this.repo.queryDetails(query)
  }
}

export const userBookService = new UserBookService();
