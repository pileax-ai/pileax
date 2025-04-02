import type { Chat, ChatUpdate } from "@/api/ai/model/chat.model";
import type { Query } from "@/core/api/commonModel";
import { buildFilters, buildOrders } from '@/core/utils/drizzle';

import { db } from '@/drizzle'
import { chat } from '@/drizzle/schema'
import { and, AnyColumn, asc, desc, eq, like, sql } from 'drizzle-orm'

export class ChatRepository {

  async create(data: Chat) {
    return db.insert(chat).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(chat).where(eq(chat.id, id)).get();
  }

  async update(data: ChatUpdate) {
    const id = data.id || '';
    await db.update(chat).set(data).where(eq(chat.id, id));
    return this.findById(id)
  }

  async delete(id: string) {
    return db.delete(chat).where(eq(chat.id, id));
  }

  async findAll(sessionId: string) {
    return db.select().from(chat)
      .where(eq(chat.sessionId, sessionId))
      .orderBy(asc(chat.createTime));
  }

  async query(query: Query) {
    const filters = buildFilters(chat, ['sessionId'], query.condition);
    const orders = buildOrders(chat, ['createTime', 'updateTime'], query.orderBy);

    return db.select().from(chat)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }
}
