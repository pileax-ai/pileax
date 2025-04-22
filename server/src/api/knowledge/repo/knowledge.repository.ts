import type { Knowledge, KnowledgeUpdate } from "@/api/knowledge/model/knowledge.model";
import type { Query } from "@/core/api/commonModel";
import { buildFilters, buildOrders } from '@/core/utils/drizzle';

import { db } from '@/drizzle'
import { knowledge } from '@/drizzle/schema'
import { and, eq, sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export class KnowledgeRepository {

  async create(data: Knowledge) {
    data.id = data.id || randomUUID();
    data.status = 1;
    return db.insert(knowledge).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(knowledge).where(eq(knowledge.id, id)).get();
  }

  async update(data: KnowledgeUpdate) {
    const id = data.id || '';
    await db.update(knowledge).set(data).where(eq(knowledge.id, id));
    return this.findById(id)
  }

  async delete(id: string) {
    return db.delete(knowledge).where(eq(knowledge.id, id));
  }

  async getAll(userId: string) {
    return db.select().from(knowledge).where(eq(knowledge.userId, userId)).all();
  }

  async query(query: Query) {
    const filters = buildFilters(knowledge, ['name', 'userId'], query.condition);
    const orders = buildOrders(knowledge, ['name', 'updateTime'], query.orderBy);

    const list = await db.select().from(knowledge)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(knowledge)
      .where(and(...filters));

    return {
      list,
      total: count,
      pageIndex: query.pageIndex,
      pageSize: query.pageSize
    }
  }

}
