import type { BookAnnotation, BookAnnotationUpdate } from "@/api/reading/model/book-annotation.model";
import type { Query } from "@/core/api/commonModel";

import { db } from '@/drizzle'
import { book, bookAnnotation, note } from '@/drizzle/schema'
import { and, Column, desc, eq, getTableColumns } from 'drizzle-orm'
import { buildFilters, buildOrders } from '@/core/utils/drizzle'
import { randomUUID } from 'node:crypto'

export class BookAnnotationRepository {

  async create(data: BookAnnotation) {
    data.id = data.id || randomUUID();
    return db.insert(bookAnnotation).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(bookAnnotation).where(eq(bookAnnotation.id, id)).get();
  }

  async find(where: any) {
    return db.select().from(bookAnnotation).all();
  }

  async update(data: BookAnnotationUpdate) {
    const id = data.id || '';
    await db.update(bookAnnotation).set(data).where(eq(bookAnnotation.id, id));
    return this.findById(id)
  }

  async delete(id: string) {
    return db.delete(bookAnnotation).where(eq(bookAnnotation.id, id));
  }

  async getAll(userId: string) {
    return db.select().from(note).where(eq(note.userId, userId)).all();
  }

  async queryAll(query: Record<string, string>) {
    const filters = [];
    if (query?.bookId) {
      filters.push(eq(bookAnnotation.bookId, query.bookId));
    }

    return db.select().from(bookAnnotation)
      .where(and(...filters))
      .all();
  }

  async query(query: Query) {
    const filters = buildFilters(bookAnnotation, ['note', 'bookId', 'type', 'userId'], query.condition);
    const orders = buildOrders(bookAnnotation, ['note', 'updateTime'], query.orderBy);

    return db.select().from(bookAnnotation)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }

  async queryBook(query: Query) {
    const filters = buildFilters(bookAnnotation, ['note', 'bookId', 'type', 'userId'], query.condition);
    const orders = buildOrders(bookAnnotation, ['note', 'updateTime'], query.orderBy);

    return db.select({
      ...getTableColumns(bookAnnotation),
      bookTitle: book.title,
      path: book.path,
      fileName: book.fileName,
      coverName: book.coverName
    }).from(bookAnnotation)
      .leftJoin(book, eq(bookAnnotation.bookId, book.id))
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }
}
