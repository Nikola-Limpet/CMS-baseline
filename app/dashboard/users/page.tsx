import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getAllUsersForAdmin } from '@/lib/dal/users';
import { UsersDashboardClient } from '@/components/dashboard/users/UsersDashboardClient';
import { redirect } from 'next/navigation';

interface UsersPageProps {
  searchParams: Promise<{ page?: string; limit?: string; role?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) redirect('/sign-in');

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const role = params.role || 'all';

  const { users, pagination } = await getAllUsersForAdmin({ page, limit, role });

  return (
    <UsersDashboardClient
      initialUsers={users}
      pagination={pagination}
      currentPage={page}
      currentRole={role}
    />
  );
}
