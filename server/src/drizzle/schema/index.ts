import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'

const base = {
  createTime: text().default(sql`(CURRENT_TIMESTAMP)`),
  updateTime: text().default(sql`(CURRENT_TIMESTAMP)`),
}

export const note = sqliteTable('note', {
  id: text('id').primaryKey().unique(),
  parent: text('parent').default(''),
  title: text('title').notNull(),
  content: text('content').notNull(),
  icon: text('icon').default(''),
  cover: text('cover').default(''),
  ...base
});
