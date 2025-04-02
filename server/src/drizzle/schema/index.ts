import { sqliteTable, integer, real, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'

const id = {
  id: integer({ mode: 'number' })
    .primaryKey({ autoIncrement: true })
}

const timestamps = {
  createTime: text('create_time')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc'))`)
    .notNull(),
  updateTime: text('update_time')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc'))`)
    .$onUpdate(() => new Date().toISOString())
    .notNull()
}

export const note = sqliteTable('note', {
  id: text().primaryKey().unique(),
  parent: text().default(''),
  title: text().notNull(),
  content: text().notNull(),
  icon: text().default(''),
  cover: text().default(''),
  ...timestamps
});

export const book = sqliteTable('book', {
  ...id,
  uuid: text().unique().notNull(),
  title: text().notNull(),
  path: text().notNull(),
  fileName: text('file_name').default(''),
  extension: text().default(''),
  coverName: text('cover_name').default(''),
  rating: integer().default(0),
  author: text().default(''),
  language: text().default(''),
  description: text().default(''),
  publisher: text().default(''),
  published: text().default(''),
  readingPosition: text('reading_position').default(''),
  readingPercentage: real('reading_percentage').default(0.0),
  ...timestamps
});

export const bookAnnotation = sqliteTable('book_annotation', {
  ...id,
  bookId: integer('book_id').notNull(),
  type: text().notNull(),
  value: text().notNull(),
  note: text().default(''),
  color: text().default(''),
  page: integer().default(0),
  chapter: text().default(''),
  ...timestamps
});

export const chatSession = sqliteTable('chat_session', {
  id: text().primaryKey().unique(),
  userId: integer('user_id').default(0),
  title: text().default(''),
  name: text().notNull(),
  status: integer().default(0),
  ...timestamps
});

export const chat = sqliteTable('chat', {
  id: text().primaryKey().unique(),
  userId: integer('user_id').default(0),
  sessionId: text('session_id').notNull(),
  message: text().notNull(),
  response: text().notNull(),
  provider: text().notNull(),
  model: text().default(''),
  result: integer().default(0),
  like: integer().default(0),
  status: integer().default(1),
  ...timestamps
});
