import type { User, UserUpdate } from "@/api/user/model/user.model";
import { Query, SortFields } from '@/core/api/commonModel'
import { buildFilters, buildOrders } from '@/core/utils/drizzle';

import { db } from '@/drizzle'
import { note, user } from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export class UserRepository {

  async create(data: User) {
    data.id = data.id || randomUUID();
    data.status = 1;
    return db.insert(user).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(user).where(eq(user.id, id)).get();
  }

  async update(data: UserUpdate) {
    const id = data.id || '';
    await db.update(user).set(data).where(eq(user.id, id));
    return this.findById(id)
  }

  async delete(id: string) {
    return db.delete(user).where(eq(user.id, id));
  }

  async getAll(userId: string) {
    return db.select().from(user).all();
  }

  async query(query: Query) {
    const filters = buildFilters(user, ['name', 'phone', 'status'], query.condition);
    const orders = buildOrders(user, [...SortFields, 'name', 'status'], query.sort);

    return db.select().from(user)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }
}
