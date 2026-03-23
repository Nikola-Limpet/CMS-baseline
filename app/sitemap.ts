import { MetadataRoute } from 'next';
import { db } from '@/db';
import { blogPosts, events } from '@/db/schema';
import { eq } from 'drizzle-orm';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  // Published blog posts (exclude noIndex)
  const posts = await db
    .select({
      slug: blogPosts.slug,
      updatedAt: blogPosts.updatedAt,
      noIndex: blogPosts.noIndex,
    })
    .from(blogPosts)
    .where(eq(blogPosts.published, true));

  const blogPages: MetadataRoute.Sitemap = posts
    .filter(p => !p.noIndex)
    .map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // Published events (exclude noIndex)
  const eventRows = await db
    .select({
      slug: events.slug,
      updatedAt: events.updatedAt,
      noIndex: events.noIndex,
    })
    .from(events)
    .where(eq(events.published, true));

  const eventPages: MetadataRoute.Sitemap = eventRows
    .filter(e => !e.noIndex)
    .map(event => ({
      url: `${BASE_URL}/events/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [...staticPages, ...blogPages, ...eventPages];
}
