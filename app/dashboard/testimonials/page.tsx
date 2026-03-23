import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getAllTestimonialsForAdmin } from '@/lib/dal/testimonials';
import { TestimonialsDashboardClient } from '@/components/dashboard/testimonials/TestimonialsDashboardClient';
import { redirect } from 'next/navigation';

export default async function TestimonialsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect('/sign-in');

  const initialData = await getAllTestimonialsForAdmin();

  return <TestimonialsDashboardClient initialData={initialData} />;
}
