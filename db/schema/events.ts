import { boolean, pgTable, text, timestamp, uuid, varchar, index } from 'drizzle-orm/pg-core';

// =============================================================================
// EVENTS TABLE
// =============================================================================

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  coverImage: varchar('cover_image', { length: 500 }),
  published: boolean('published').default(false).notNull(),
  publishedAt: timestamp('published_at'),
  eventDate: timestamp('event_date').notNull(),
  eventEndDate: timestamp('event_end_date'),
  location: varchar('location', { length: 255 }),
  registrationUrl: varchar('registration_url', { length: 500 }),
  userId: varchar('user_id', { length: 255 }).notNull(),
  // SEO fields
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: varchar('meta_description', { length: 500 }),
  ogImage: varchar('og_image', { length: 500 }),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  noIndex: boolean('no_index').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  publishedIdx: index('events_published_idx').on(table.published),
  eventDateIdx: index('events_event_date_idx').on(table.eventDate),
  publishedAndDateIdx: index('events_published_date_idx').on(table.published, table.eventDate),
  userIdIdx: index('events_user_id_idx').on(table.userId),
  titleSearchIdx: index('events_title_search_idx').on(table.title),
}));

// =============================================================================
// EVENT CATEGORIES TABLE
// =============================================================================

export const eventCategories = pgTable('event_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// =============================================================================
// EVENT CATEGORIES JUNCTION TABLE
// =============================================================================

export const eventPostCategories = pgTable('event_post_categories', {
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => eventCategories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  eventCategoryIdx: index('event_post_categories_event_idx').on(table.eventId),
  categoryEventIdx: index('event_post_categories_category_idx').on(table.categoryId),
}));

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventCategory = typeof eventCategories.$inferSelect;
export type NewEventCategory = typeof eventCategories.$inferInsert;
