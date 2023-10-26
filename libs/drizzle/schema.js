import { relations, sql } from 'drizzle-orm'
import { json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const caption = pgTable('caption', {
  videoId: text('videoId').primaryKey().unique().notNull(),
  thumbnail: text('thumbnail').notNull(),
  youtuberId: text('youtuberId').notNull(),
  transcribedWithLyrics: text('transcribedWithLyrics'),
  captionChunks: text('captionChunks').notNull(),
  videoTitle: text('videoTitle').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).default(sql`now()`),
})

export const polls = pgTable('polls', {
  id: uuid('id').primaryKey().notNull(),
  options: json('options'),
  enabled: text('enabled').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).default(sql`now()`),
})

export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().notNull(),
  picked_option: uuid('picked_option'),
  poll: uuid('poll')
    .notNull()
    .references(() => polls.id),
  createdAt: timestamp('created_at', { mode: 'date' }).default(sql`now()`),
})

export const youtuber = pgTable('youtuber', {
  id: text('id').primaryKey().unique().notNull(),
  name: text('name').notNull(),
  url: text('url'),
  createdAt: timestamp('created_at', { mode: 'date' }).default(sql`now()`),
})

export const pollsRelations = relations(polls, ({ many }) => ({
  votes: many(votes),
}))

export const votesRelations = relations(votes, ({ one }) => ({
  poll: one(polls),
}))
