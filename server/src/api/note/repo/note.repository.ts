import type { Note, NoteUpdate } from "@/api/note/model/note.model";
import type { Query } from "@/core/api/commonModel";

import { db } from '@/drizzle'
import { fileMeta, note } from '@/drizzle/schema'
import { and, desc, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { buildFilters, buildOrders } from '@/core/utils/drizzle'

export class NoteRepository {

  async create(data: Note) {
    data.id = data.id || randomUUID();
    return db.insert(note).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(note).where(eq(note.id, id)).get();
  }

  async update(data: NoteUpdate) {
    const id = data.id || '';
    await db.update(note).set(data).where(eq(note.id, id));
    return this.findById(id)
  }

  /**
   * Delete note and its children
   * @param id
   */
  async delete(id: string) {
    return db.delete(note).where(eq(note.id, id));
    // return prisma.$transaction(async (tx) => {
    //   const children = await tx.note.findMany({
    //     where: { parent: id }
    //   })
    //
    //   await Promise.all(children.map(child => this.delete(child.id)))
    //   await tx.note.delete({ where: { id } })
    // })
  }

  async getAll(userId: string) {
    return db.select().from(note).where(eq(note.userId, userId)).all();
  }

  async query(query: Query) {
    const filters = buildFilters(note, ['refId', 'refType', 'parent', 'title', 'userId'], query.condition);
    const orders = buildOrders(note, ['title', 'updateTime'], query.orderBy);

    return db.select()
      .from(note)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }
}
