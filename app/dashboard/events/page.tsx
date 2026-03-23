import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getAllEventsForAdmin } from '@/lib/dal/events';
import { EventsDashboardClient } from '@/components/dashboard/events/EventsDashboardClient';
import { redirect } from 'next/navigation';

export default async function EventsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) redirect('/sign-in');

  const initialData = await getAllEventsForAdmin();

  return <EventsDashboardClient initialData={initialData} />;
}
