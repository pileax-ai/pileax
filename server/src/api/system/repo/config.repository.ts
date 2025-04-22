import type { Config, ConfigUpdate } from "@/api/system/model/config.model";
import type { Query } from "@/core/api/commonModel";

import { db } from '@/drizzle'
import { fileMeta, config } from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { buildFilters, buildOrders } from '@/core/utils/drizzle'

export class ConfigRepository {

  async create(data: Config) {
    data.id = data.id || randomUUID();
    return db.insert(config).values(data).returning().get();
  }

  async findById(id: string) {
    return db.select().from(config).where(eq(config.id, id)).get();
  }

  async findByOwnerAndKey(owner: string, key: string) {
    const filters = buildFilters(config,
      ['owner', 'key'], { owner, key });
    return db.select().from(config).where(and(...filters)).get();
  }

  async update(data: ConfigUpdate) {
    const id = data.id || '';
    await db.update(config).set(data).where(eq(config.id, id));
    return this.findById(id)
  }

  async delete(id: string) {
    return db.delete(config).where(eq(config.id, id));
  }

  async deleteByOwner(owner: string) {
    return db.delete(config).where(eq(config.owner, owner));
  }

  async getAll(scope: string) {
    return db.select().from(config).where(eq(config.scope, scope)).all();
  }

  async query(query: Query) {
    const filters = buildFilters(config, ['owner', 'scope'], query.condition);
    const orders = buildOrders(config, ['name', 'owner', 'scope', 'updateTime'], query.orderBy);

    return db.select()
      .from(config)
      .where(and(...filters))
      .limit(query.pageSize)
      .offset((query.pageIndex - 1) * query.pageSize)
      .orderBy(...orders);
  }
}
