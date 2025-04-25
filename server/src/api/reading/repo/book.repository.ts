import type { Book, BookUpdate } from "@/api/reading/model/book.model";
import { Query, SortFields } from '@/core/api/commonModel'
import { buildFilters, buildOrders } from '@/core/utils/drizzle';

import { db } from '@/drizzle'
import { book } from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
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

  async delete(id: string) {
    return db.delete(book).where(eq(book.id, id));
  }

  async getAll(userId: string) {
    return db.select().from(book).where(eq(book.userId, userId)).all();
  }

  async query(query: Query) {
    const filters = buildFilters(book, ['title', 'userId'], query.condition);
    const orders = buildOrders(book, [...SortFields, 'title'], query.sort);

    return db.select().from(book)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }
}
