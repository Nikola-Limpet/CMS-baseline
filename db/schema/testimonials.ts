import { boolean, integer, pgTable, text, timestamp, uuid, varchar, index } from 'drizzle-orm/pg-core';

export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorTitle: varchar('author_title', { length: 255 }),
  authorImage: varchar('author_image', { length: 500 }),
  content: text('content').notNull(),
  rating: integer('rating'),
  featured: boolean('featured').default(false).notNull(),
  published: boolean('published').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  publishedIdx: index('testimonials_published_idx').on(table.published),
  featuredIdx: index('testimonials_featured_idx').on(table.featured),
  orderIdx: index('testimonials_order_idx').on(table.displayOrder),
}));

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
