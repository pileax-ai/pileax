import type { Book, BookUpdate } from "@/api/reading/model/bookModel";
import type { Query } from "@/core/api/commonModel";

import { db } from '@/drizzle'
import { book } from '@/drizzle/schema'
import { and, desc, eq, like, sql } from 'drizzle-orm'

export class BookRepository {

  async create(data: Book) {
    delete data.id;
    return db.insert(book).values(data).returning().get();
  }

  async findById(id: number) {
    return db.select().from(book).where(eq(book.id, id)).get();
  }

  async findByUuid(uuid: string) {
    return db.select().from(book).where(eq(book.uuid, uuid)).get();
  }

  async update(data: BookUpdate) {
    const id = data.id || 0;
    await db.update(book).set(data).where(eq(book.id, id));
    return this.findById(id)
  }

  /**
   * Delete book and its children
   * @param id
   */
  async delete(id: number) {
    return db.delete(book).where(eq(book.id, id));
  }

  async getAll() {
    return db.select().from(book).all();
  }

  async query(query: Query) {
    const filters = [];
    const condition: Record<string, unknown> = query.condition || {};
    if (condition.title && typeof condition.title === 'string') {
      filters.push(
        like(sql`LOWER(${book.title})`,
  `%${condition.title.toLowerCase()}%`)
      )
    }

    return db.select().from(book)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(desc(book.updateTime));
  }
}
