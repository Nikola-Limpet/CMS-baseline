import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getAllMediaForAdmin, getMediaStats } from '@/lib/dal/media';
import { MediaDashboardClient } from '@/components/dashboard/media/MediaDashboardClient';
import { redirect } from 'next/navigation';

export default async function MediaPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect('/sign-in');

  const [initialData, stats] = await Promise.all([
    getAllMediaForAdmin(),
    getMediaStats(),
  ]);

  return <MediaDashboardClient initialData={initialData} stats={stats} />;
}
