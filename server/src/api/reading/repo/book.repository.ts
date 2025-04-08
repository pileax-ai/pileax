import type { Book, BookUpdate } from "@/api/reading/model/book.model";
import type { Query } from "@/core/api/commonModel";
import { buildFilters, buildOrders } from '@/core/utils/drizzle';

import { db } from '@/drizzle'
import { book } from '@/drizzle/schema'
import { and, AnyColumn, asc, desc, eq, like, sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export class BookRepository {

  async create(data: Book) {
    data.id = data.id || randomUUID();
    return db.insert(book).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(book).where(eq(book.id, id)).get();
  }

  async findByUuid(uuid: string) {
    return db.select().from(book).where(eq(book.uuid, uuid)).get();
  }

  async update(data: BookUpdate) {
    const id = data.id || '';
    await db.update(book).set(data).where(eq(book.id, id));
    return this.findById(id)
  }

  /**
   * Delete book and its children
   * @param id
   */
  async delete(id: string) {
    return db.delete(book).where(eq(book.id, id));
  }

  async getAll() {
    return db.select().from(book).all();
  }

  async query(query: Query) {
    const filters = buildFilters(book, ['title'], query.condition);
    const orders = buildOrders(book, ['title', 'updateTime'], query.orderBy);

    return db.select().from(book)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }
}
