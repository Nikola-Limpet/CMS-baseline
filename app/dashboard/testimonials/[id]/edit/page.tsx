import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TestimonialForm from '@/components/dashboard/testimonials/TestimonialForm';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Edit Testimonial - CMS Dashboard',
};

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params;

  const [testimonial] = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);

  if (!testimonial) notFound();

  return <TestimonialForm testimonialToEdit={testimonial} />;
}
