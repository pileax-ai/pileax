import { sqliteTable, integer, real, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const autoId = {
  id: integer({ mode: 'number' })
    .primaryKey({ autoIncrement: true })
}

const uniqueId = {
  id: text().primaryKey().unique()
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

export const user = sqliteTable('user', {
  id: text().primaryKey().unique(),
  diallingCode: text('dialling_code').default(''),
  phone: text().default(''),
  email: text().default(''),
  name: text().notNull(),
  bio: text().default(''),
  avatar: text().default(''),
  cover: text().default(''),
  password: text(),
  remarks: text().default(''),
  status: integer().default(1),
  ...timestamps
});

export const note = sqliteTable('note', {
  id: text().primaryKey().unique(),
  userId: text('user_id').default(''),
  parent: text().default(''),
  title: text().notNull(),
  content: text().notNull(),
  icon: text().default(''),
  cover: text().default(''),
  chatId: text('chat_id').default(''),
  ...timestamps
});

export const book = sqliteTable('book', {
  id: text().primaryKey().unique(),
  userId: text('user_id').default(''),
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
  id: text().primaryKey().unique(),
  userId: text('user_id').default(''),
  bookId: text('book_id').notNull(),
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
  userId: text('user_id').default(''),
  title: text().default(''),
  name: text().notNull(),
  status: integer().default(0),
  ...timestamps
});

export const chat = sqliteTable('chat', {
  id: text().primaryKey().unique(),
  userId: text('user_id').default(''),
  sessionId: text('session_id').notNull(),
  message: text().notNull(),
  content: text().notNull(),
  reasoning: integer().default(0),
  reasoningContent: text('reasoning_content').default(''),
  provider: text().notNull(),
  model: text().default(''),
  result: integer().default(0),
  like: integer().default(0),
  noteId: text('note_id').default(''),
  status: integer().default(1),
  ...timestamps
});

export const fileMeta = sqliteTable('file_meta', {
  id: text().primaryKey().unique(),
  userId: text('user_id').default(''),
  mimetype: text().default(''),
  size: integer().default(0),
  originalName: text('original_name').default(''),
  fileName: text('file_name').default(''),
  url: text().default(''),
  path: text().default(''),
  refId: text('ref_id').default(''),
  refType: text('ref_type').default(''),
  status: integer().default(1),
  ...timestamps
});
