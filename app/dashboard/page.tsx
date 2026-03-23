import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/dal/users';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await getUserById(userId);
  const isAdmin = user?.role === 'admin';

  return (
    <DashboardClient
      userId={userId}
      isAdmin={isAdmin}
    />
  );
}
