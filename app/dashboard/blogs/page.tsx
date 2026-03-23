import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getAllBlogPostsForAdmin } from '@/lib/dal/blogs';
import { BlogsDashboardClient } from '@/components/dashboard/blogs/BlogsDashboardClient';
import { redirect } from 'next/navigation';

export default async function BlogsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) redirect('/sign-in');

  const initialData = await getAllBlogPostsForAdmin();

  return <BlogsDashboardClient initialData={initialData} />;
}
