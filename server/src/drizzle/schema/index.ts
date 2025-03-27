import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'

const common = {
  createTime: text()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc'))`)
    .notNull(),
  updateTime: text()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc'))`)
    .$onUpdate(() => new Date().toISOString())
    .notNull()
}

export const note = sqliteTable('note', {
  id: text('id').primaryKey().unique(),
  parent: text('parent').default(''),
  title: text('title').notNull(),
  content: text('content').notNull(),
  icon: text('icon').default(''),
  cover: text('cover').default(''),
  ...common
});
