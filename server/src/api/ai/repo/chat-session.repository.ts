import type { ChatSession, ChatSessionUpdate } from "@/api/ai/model/chat-session.model";
import type { Query } from "@/core/api/commonModel";
import { buildFilters, buildOrders } from '@/core/utils/drizzle';

import { db } from '@/drizzle'
import { chatSession } from '@/drizzle/schema'
import { and, AnyColumn, asc, desc, eq, like, sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export class ChatSessionRepository {

  async create(data: ChatSession) {
    data.id = data.id || randomUUID();
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

  async getAll() {
    return db.select().from(chatSession).all();
  }

  async query(query: Query) {
    const filters = buildFilters(chatSession, ['title'], query.condition);
    const orders = buildOrders(chatSession, ['title', 'updateTime'], query.orderBy);

    return db.select().from(chatSession)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }
}
