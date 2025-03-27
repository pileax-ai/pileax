import type { Note, NoteUpdate, NoteQuery } from "@/api/note/model/noteModel";

import { db } from '@/drizzle'
import { note } from '@/drizzle/schema'
import { and, desc, eq } from 'drizzle-orm'

export class NoteRepository {

  async create(data: Note) {
    return db.insert(note).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(note).where(eq(note.id, id)).get();
  }

  async find(where: any) {
    return db.select().from(note).all();
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

  async getAll() {
    return db.select().from(note).all();
  }

  async query(query: NoteQuery) {
    const filters = [];
    const condition: Record<string, unknown> = query.condition || {};
    if (condition.title) filters.push(eq(note.title, condition.title as any))

    return db.select().from(note)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(desc(note.updateTime));
  }
}
