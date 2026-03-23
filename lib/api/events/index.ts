import { apiFetch } from '../fetch-client';
import type { Event, EventCategory } from '@/db/schema';

export type EventData = {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  published: boolean;
  user_id: string;
  event_date: string;
  event_end_date?: string;
  location?: string;
  registration_url?: string;
  categories?: string[];
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  canonical_url?: string;
  no_index?: boolean;
};

export const eventsApi = {
  posts: {
    getAll: async (options?: {
      published?: boolean;
      limit?: number;
      offset?: number;
      search?: string;
      categoryId?: string;
      upcoming?: boolean;
    }) => {
      const searchParams = new URLSearchParams();
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined) searchParams.set(key, String(value));
        });
      }
      const query = searchParams.toString();
      return apiFetch(`/api/events${query ? `?${query}` : ''}`);
    },

    getById: async (id: string) => {
      return apiFetch(`/api/events/${id}`);
    },

    create: async (data: EventData) => {
      return apiFetch<Event>('/api/events', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: Partial<EventData>) => {
      return apiFetch(`/api/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return apiFetch(`/api/events/${id}`, { method: 'DELETE' });
    },
  },

  categories: {
    getAll: async (): Promise<EventCategory[]> => {
      return apiFetch<EventCategory[]>('/api/events/categories');
    },

    create: async (data: { name: string; description?: string }) => {
      return apiFetch<EventCategory>('/api/events/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
};
