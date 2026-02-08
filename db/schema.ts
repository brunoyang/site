import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  titleZh: text('title_zh').notNull(),
  excerpt: text('excerpt').notNull(),
  excerptZh: text('excerpt_zh').notNull(),
  content: text('content').notNull(),
  contentZh: text('content_zh').notNull(),
  author: text('author').notNull(),
  date: text('date').notNull(),
});

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull(),
});
