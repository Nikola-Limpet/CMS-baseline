import { Metadata } from 'next';
import TestimonialForm from '@/components/dashboard/testimonials/TestimonialForm';

export const metadata: Metadata = {
  title: 'Add Testimonial - CMS Dashboard',
};

export default function NewTestimonialPage() {
  return <TestimonialForm testimonialToEdit={null} />;
}
