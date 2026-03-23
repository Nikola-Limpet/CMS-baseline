import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventPostForm from '@/components/dashboard/events/EventPostForm';
import { db } from '@/db';
import { events, eventPostCategories, type Event } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Edit Event - CMS Dashboard',
  description: 'Edit an existing event',
};

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

async function getEventById(
  id: string
): Promise<(Event & { categories: string[] }) | undefined> {
  try {
    const result = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);
    if (!result.length) return undefined;

    const categoryRelations = await db
      .select({ categoryId: eventPostCategories.categoryId })
      .from(eventPostCategories)
      .where(eq(eventPostCategories.eventId, id));

    return {
      ...result[0],
      categories: categoryRelations.map(r => r.categoryId),
    };
  } catch (error) {
    console.error('Database error fetching event:', error);
    throw new Error('Failed to load event details.');
  }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return <EventPostForm eventToEdit={event} />;
}
