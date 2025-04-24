import type { ChatSession, ChatSessionUpdate } from "@/api/ai/model/chat-session.model";
import type { Query } from "@/core/api/commonModel";
import { buildFilters, buildOrders } from '@/core/utils/drizzle';

import { db } from '@/drizzle'
import { chatSession } from '@/drizzle/schema'
import { and, eq, sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export class ChatSessionRepository {

  async create(data: ChatSession) {
    data.id = data.id || randomUUID();
    data.status = 1;
    return db.insert(chatSession).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(chatSession).where(eq(chatSession.id, id)).get();
  }

  async update(data: ChatSessionUpdate) {
    const id = data.id || '';
    await db.update(chatSession).set(data).where(eq(chatSession.id, id));
    return this.findById(id)
  }

  async delete(id: string) {
    return db.delete(chatSession).where(eq(chatSession.id, id));
  }

  async getAll(userId: string) {
    return db.select().from(chatSession).where(eq(chatSession.userId, userId)).all();
  }

  async query(query: Query) {
    const filters = buildFilters(chatSession, ['refId', 'refType', 'title', 'userId'], query.condition);
    const orders = buildOrders(chatSession, ['title', 'updateTime'], query.sort);

    const list = await db.select().from(chatSession)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(chatSession)
      .where(and(...filters));

    return {
      list,
      // total: count,
      pageIndex: query.pageIndex,
      pageSize: query.pageSize
    }
  }
}
