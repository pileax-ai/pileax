import type { UserBook, UserBookUpdate } from "@/api/reading/model/user-book.model";
import { Query, SortFields } from '@/core/api/commonModel'

import { db } from '@/drizzle'
import { book, userBook, note } from '@/drizzle/schema'
import { and, eq, getTableColumns } from 'drizzle-orm'
import { buildFilters, buildOrders, parseColumns } from '@/core/utils/drizzle'
import { randomUUID } from 'node:crypto'

export class UserBookRepository {

  async create(data: UserBook) {
    data.id = data.id || randomUUID();
    return db.insert(userBook).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(userBook).where(eq(userBook.id, id)).get();
  }

  async findDetailsById(id: string) {
    return db.select(this.getDetailsColumns())
      .from(userBook)
      .leftJoin(book, eq(userBook.bookId, book.id))
      .where(eq(userBook.id, id))
      .get();
  }

  async findDetailsByBook(userId: string, bookId: string) {
    return db.select(this.getDetailsColumns())
      .from(userBook)
      .leftJoin(book, eq(userBook.bookId, book.id))
      .where(
        and(
          eq(userBook.userId, userId),
          eq(userBook.bookId, bookId)
        )
      )
      .get();
  }

  async find(where: any) {
    return db.select().from(userBook).all();
  }

  async update(data: UserBookUpdate) {
    const id = data.id || '';
    await db.update(userBook).set(data).where(eq(userBook.id, id));
    return this.findById(id)
  }

  async delete(id: string) {
    return db.delete(userBook).where(eq(userBook.id, id));
  }

  async getAll(userId: string) {
    return db.select().from(note).where(eq(note.userId, userId)).all();
  }

  async queryAll(query: Record<string, string>) {
    const filters = [];
    if (query?.bookId) {
      filters.push(eq(userBook.bookId, query.bookId));
    }

    return db.select().from(userBook)
      .where(and(...filters))
      .all();
  }

  async query(query: Query) {
    const filters = buildFilters(userBook, ['bookId', 'userId'], query.condition);
    const orders = buildOrders(userBook, [...SortFields], query.sort);

    return db.select().from(userBook)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }

  async queryDetails(query: Query) {
    const userBookFilters = buildFilters(userBook, ['userId'], query.condition);
    const bookFilters = buildFilters(book, ['title'], query.condition);
    const filters = [...userBookFilters, ...bookFilters];

    const userBookOrders = buildOrders(userBook, [...SortFields], query.sort);
    const bookOrders = buildOrders(book, ['title'], query.sort);
    const orders = [...userBookOrders, ...bookOrders];

    return db.select(this.getDetailsColumns()).from(userBook)
      .leftJoin(book, eq(userBook.bookId, book.id))
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }

  getDetailsColumns() {
    return {
      ...getTableColumns(userBook),
      owner: book.userId,
      title: book.title,
      path: book.path,
      fileName: book.fileName,
      coverName: book.coverName,
      author: book.author,
      language: book.language,
      description: book.description,
      publisher: book.publisher,
      published: book.published,
      scope: book.scope,
      bookRating: book.rating,
    };
  }
}
