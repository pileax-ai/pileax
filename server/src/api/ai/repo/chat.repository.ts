import type { Chat, ChatUpdate } from "@/api/ai/model/chat.model";
import { Query, SortFields } from '@/core/api/commonModel'
import { buildFilters, buildOrders } from '@/core/utils/drizzle';

import { db } from '@/drizzle';
import { chat } from '@/drizzle/schema';
import { and, asc, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export class ChatRepository {

  async create(data: Chat) {
    data.id = data.id || randomUUID();
    data.status = 1;
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

  async getAll(userId: string) {
    return db.select().from(chat).where(eq(chat.userId, userId)).all();
  }

  async findBySession(sessionId: string) {
    return db.select().from(chat)
      .where(eq(chat.sessionId, sessionId))
      .orderBy(asc(chat.createTime));
  }

  async query(query: Query) {
    const filters = buildFilters(chat, ['sessionId', 'userId'], query.condition);
    const orders = buildOrders(chat, [...SortFields], query.sort);

    return db.select().from(chat)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }
}
