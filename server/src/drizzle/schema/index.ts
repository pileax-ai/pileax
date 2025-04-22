import { sqliteTable, integer, real, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm';

// ------------------------------------------------------------
// Common
// ------------------------------------------------------------
const timestamps = {
  createTime: text('create_time')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc'))`)
    .notNull(),
  updateTime: text('update_time')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc'))`)
    .$onUpdate(() => new Date().toISOString())
    .notNull()
}

// ------------------------------------------------------------
// Tables
// ------------------------------------------------------------

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

export const chatSession = sqliteTable('chat_session', {
  id: text().primaryKey().unique(),
  userId: text('user_id').default(''),
  title: text().default(''),
  name: text().notNull(),
  refId: text('ref_id').default(''), // reference Id
  refType: text('ref_type').default('general'), // general, note, knowledge
  status: integer().default(0),
  ...timestamps
});

export const config = sqliteTable(
  'config',
  {
    id: text().primaryKey().unique(),
    name: text().default(''),
    type: text().default(''),
    datatype: text().default(''),
    key: text().notNull(),
    value: text().default(''),
    owner: text().default(''),
    scope: text().default('system'),
    ...timestamps
  },
  (t) => ({
    keyOwnerUnique: uniqueIndex('config_key_owner_unique').on(t.key, t.owner),
    scopeIdx: index('config_scope_idx').on(t.scope),
  })
);

export const fileMeta = sqliteTable('file_meta', {
  id: text().primaryKey().unique(),
  userId: text('user_id').default(''),
  mimetype: text().default(''),
  size: integer().default(0),
  originalName: text('original_name').default(''),
  fileName: text('file_name').default(''),
  url: text().default(''),
  path: text().default(''),
  refId: text('ref_id').default(''), // reference Id
  refType: text('ref_type').default('general'),
  status: integer().default(1),
  ...timestamps
});

export const knowledge = sqliteTable('knowledge', {
  id: text().primaryKey().unique(),
  userId: text('user_id').default(''),
  name: text().default(''),
  description: text().default(''),
  logo: text().default(''),
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
  refId: text('ref_id').default(''), // reference Id
  refType: text('ref_type').default('general'), // general, chat, book, etc.
  ...timestamps
});

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
