import { integer, pgTable, text, timestamp, uuid, varchar, index } from 'drizzle-orm/pg-core';

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  s3Key: varchar('s3_key', { length: 500 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(), // bytes
  altText: varchar('alt_text', { length: 255 }),
  uploadedBy: varchar('uploaded_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uploadedByIdx: index('media_assets_uploaded_by_idx').on(table.uploadedBy),
  mimeTypeIdx: index('media_assets_mime_type_idx').on(table.mimeType),
  createdAtIdx: index('media_assets_created_at_idx').on(table.createdAt),
}));

export type MediaAsset = typeof mediaAssets.$inferSelect;
export type NewMediaAsset = typeof mediaAssets.$inferInsert;
