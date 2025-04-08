import type { FileMeta, FileMetaUpdate } from "@/api/file/model/file.model";
import type { Query } from "@/core/api/commonModel";
import { buildFilters, buildOrders } from '@/core/utils/drizzle';

import { db } from '@/drizzle'
import { fileMeta } from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export class FileMetaRepository {

  async create(data: FileMeta) {
    data.id = data.id || randomUUID();
    data.status = 1;
    return db.insert(fileMeta).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(fileMeta).where(eq(fileMeta.id, id)).get();
  }

  async update(data: FileMetaUpdate) {
    const id = data.id || '';
    await db.update(fileMeta).set(data).where(eq(fileMeta.id, id));
    return this.findById(id)
  }

  async delete(id: string) {
    return db.delete(fileMeta).where(eq(fileMeta.id, id));
  }

  async getAll(userId: string) {
    return db.select().from(fileMeta).where(eq(fileMeta.userId, userId)).all();
  }

  async query(query: Query) {
    const filters = buildFilters(fileMeta, ['mimetype', 'fileName', 'userId'], query.condition);
    const orders = buildOrders(fileMeta, ['mimetype', 'updateTime'], query.orderBy);

    return db.select().from(fileMeta)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }

}
