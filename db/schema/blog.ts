import { boolean, pgTable, text, timestamp, uuid, varchar, index } from 'drizzle-orm/pg-core';

// =============================================================================
// BLOG POSTS TABLE
// =============================================================================

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  coverImage: varchar('cover_image', { length: 500 }), // Optional S3 image URL
  published: boolean('published').default(false).notNull(),
  publishedAt: timestamp('published_at'),
  scheduledPublishAt: timestamp('scheduled_publish_at'), // For scheduled posts
  userId: varchar('user_id', { length: 255 }).notNull(), // Better Auth user ID of the author
  // SEO fields
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: varchar('meta_description', { length: 500 }),
  ogImage: varchar('og_image', { length: 500 }),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  noIndex: boolean('no_index').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Performance indexes for blog queries
  publishedIdx: index('blog_posts_published_idx').on(table.published),
  publishedAtIdx: index('blog_posts_published_at_idx').on(table.publishedAt),
  publishedAndDateIdx: index('blog_posts_published_date_idx').on(table.published, table.publishedAt),
  userIdIdx: index('blog_posts_user_id_idx').on(table.userId),
  titleSearchIdx: index('blog_posts_title_search_idx').on(table.title),
}));

// =============================================================================
// BLOG CATEGORIES TABLE
// =============================================================================

export const blogCategories = pgTable('blog_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// =============================================================================
// BLOG POST CATEGORIES JUNCTION TABLE
// =============================================================================

// Blog post to category relationship (many-to-many)
export const blogPostCategories = pgTable('blog_post_categories', {
  postId: uuid('post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => blogCategories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Composite primary key and indexes for performance
  postCategoryIdx: index('blog_post_categories_post_idx').on(table.postId),
  categoryPostIdx: index('blog_post_categories_category_idx').on(table.categoryId),
}));

// =============================================================================
// BLOG TAGS TABLE
// =============================================================================

export const blogTags = pgTable('blog_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =============================================================================
// BLOG POST TAGS JUNCTION TABLE
// =============================================================================

// Blog post to tag relationship (many-to-many)
export const blogPostTags = pgTable('blog_post_tags', {
  postId: uuid('post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => blogTags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Indexes for performance
  postTagIdx: index('blog_post_tags_post_idx').on(table.postId),
  tagPostIdx: index('blog_post_tags_tag_idx').on(table.tagId),
}));

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type NewBlogCategory = typeof blogCategories.$inferInsert;
export type BlogTag = typeof blogTags.$inferSelect;
export type NewBlogTag = typeof blogTags.$inferInsert;
