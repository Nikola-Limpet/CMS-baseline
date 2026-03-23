import { cache } from 'react';
import { db } from '@/db';
import { events, eventCategories, user } from '@/db/schema';
import { eq, desc, asc, gte, lt, and } from 'drizzle-orm';
import type { Event, EventCategory } from '@/db/schema';

export type EventWithAuthor = Event & {
  authorName: string | null;
  authorImage: string | null;
};

const eventSelectWithAuthor = {
  id: events.id,
  title: events.title,
  slug: events.slug,
  content: events.content,
  excerpt: events.excerpt,
  coverImage: events.coverImage,
  published: events.published,
  publishedAt: events.publishedAt,
  eventDate: events.eventDate,
  eventEndDate: events.eventEndDate,
  location: events.location,
  registrationUrl: events.registrationUrl,
  userId: events.userId,
  metaTitle: events.metaTitle,
  metaDescription: events.metaDescription,
  ogImage: events.ogImage,
  canonicalUrl: events.canonicalUrl,
  noIndex: events.noIndex,
  createdAt: events.createdAt,
  updatedAt: events.updatedAt,
  authorName: user.name,
  authorImage: user.image,
};

export const getUpcomingEvents = cache(
  async (limit = 10): Promise<EventWithAuthor[]> => {
    try {
      return await db
        .select(eventSelectWithAuthor)
        .from(events)
        .leftJoin(user, eq(events.userId, user.id))
        .where(and(eq(events.published, true), gte(events.eventDate, new Date())))
        .orderBy(asc(events.eventDate))
        .limit(limit);
    } catch (error) {
      console.error('[DAL] Error fetching upcoming events:', error);
      return [];
    }
  }
);

export const getPastEvents = cache(
  async (limit = 10): Promise<EventWithAuthor[]> => {
    try {
      return await db
        .select(eventSelectWithAuthor)
        .from(events)
        .leftJoin(user, eq(events.userId, user.id))
        .where(and(eq(events.published, true), lt(events.eventDate, new Date())))
        .orderBy(desc(events.eventDate))
        .limit(limit);
    } catch (error) {
      console.error('[DAL] Error fetching past events:', error);
      return [];
    }
  }
);

export const getPublishedEvents = cache(
  async (limit = 20): Promise<EventWithAuthor[]> => {
    try {
      return await db
        .select(eventSelectWithAuthor)
        .from(events)
        .leftJoin(user, eq(events.userId, user.id))
        .where(eq(events.published, true))
        .orderBy(desc(events.eventDate))
        .limit(limit);
    } catch (error) {
      console.error('[DAL] Error fetching published events:', error);
      return [];
    }
  }
);

export const getFeaturedEvent = cache(
  async (): Promise<EventWithAuthor | null> => {
    try {
      const [event] = await db
        .select(eventSelectWithAuthor)
        .from(events)
        .leftJoin(user, eq(events.userId, user.id))
        .where(and(eq(events.published, true), gte(events.eventDate, new Date())))
        .orderBy(asc(events.eventDate))
        .limit(1);
      return event ?? null;
    } catch (error) {
      console.error('[DAL] Error fetching featured event:', error);
      return null;
    }
  }
);

export const getAllEventCategories = cache(
  async (): Promise<EventCategory[]> => {
    try {
      return await db
        .select()
        .from(eventCategories)
        .orderBy(eventCategories.name);
    } catch (error) {
      console.error('[DAL] Error fetching event categories:', error);
      return [];
    }
  }
);

export const getAllEventsForAdmin = cache(
  async (): Promise<Event[]> => {
    try {
      return await db
        .select()
        .from(events)
        .orderBy(desc(events.createdAt));
    } catch (error) {
      console.error('[DAL] Error fetching all events for admin:', error);
      return [];
    }
  }
);
