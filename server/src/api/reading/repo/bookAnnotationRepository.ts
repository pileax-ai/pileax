import type { BookAnnotation, BookAnnotationUpdate } from "@/api/reading/model/bookAnnotationModel";
import type { Query } from "@/core/api/commonModel";

import { db } from '@/drizzle'
import { book, bookAnnotation } from '@/drizzle/schema'
import { and, Column, desc, eq, getTableColumns } from 'drizzle-orm'
import { bookAnnotationController } from '@/api/reading/controller/bookAnnotationController'

export class BookAnnotationRepository {

  async create(data: BookAnnotation) {
    delete data.id;
    return db.insert(bookAnnotation).values(data).returning().get();
  }

  async findById(id: number) {
    return db.select().from(bookAnnotation).where(eq(bookAnnotation.id, id)).get();
  }

  async find(where: any) {
    return db.select().from(bookAnnotation).all();
  }

  async update(data: BookAnnotationUpdate) {
    const id = data.id || 0;
    await db.update(bookAnnotation).set(data).where(eq(bookAnnotation.id, id));
    return this.findById(id)
  }

  /**
   * Delete bookAnnotation and its children
   * @param id
   */
  async delete(id: number) {
    return db.delete(bookAnnotation).where(eq(bookAnnotation.id, id));
  }

  async getAll(query: Record<string, string>) {
    const filters = [];
    if (query?.bookId) {
      filters.push(eq(bookAnnotation.bookId, parseInt(query.bookId)));
    }

    return db.select().from(bookAnnotation)
      .where(and(...filters))
      .all();
  }

  async query(query: Query) {
    const filters = [];
    const condition: Record<string, unknown> = query.condition || {};
    if (condition.bookId) filters.push(eq(bookAnnotation.bookId, condition.bookId as number))

    return db.select().from(bookAnnotation)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(desc(bookAnnotation.updateTime));
  }

  getTableColumns(table: any) {
    return Object.entries(table).reduce((acc, [key, value]) => {
      if (value instanceof Column) { // 判断是否为字段类型
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, Column>);
  }

  async queryBook(query: Query) {
    const filters = [];
    const condition: Record<string, unknown> = query.condition || {};
    if (condition.bookId) filters.push(eq(bookAnnotation.bookId, condition.bookId as number))

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
      .orderBy(desc(bookAnnotation.updateTime));
  }
}
