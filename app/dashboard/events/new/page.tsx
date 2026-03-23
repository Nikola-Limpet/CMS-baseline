import { Metadata } from 'next';
import EventPostForm from '@/components/dashboard/events/EventPostForm';

export const metadata: Metadata = {
  title: 'Create Event - CMS Dashboard',
  description: 'Create a new event',
};

export default function NewEventPage() {
  return <EventPostForm eventToEdit={null} />;
}
