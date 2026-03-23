import { apiFetch } from '../fetch-client';
import type { MediaAsset } from '@/db/schema';

export type MediaCreateData = {
  filename: string;
  s3_key: string;
  url: string;
  mime_type: string;
  size: number;
  alt_text?: string;
};

export const mediaApi = {
  getAll: async (search?: string): Promise<MediaAsset[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiFetch<MediaAsset[]>(`/api/media${query}`);
  },

  getById: async (id: string): Promise<MediaAsset> => {
    return apiFetch<MediaAsset>(`/api/media/${id}`);
  },

  create: async (data: MediaCreateData): Promise<MediaAsset> => {
    return apiFetch<MediaAsset>('/api/media', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAltText: async (id: string, altText: string): Promise<MediaAsset> => {
    return apiFetch<MediaAsset>(`/api/media/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ alt_text: altText }),
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/api/media/${id}`, { method: 'DELETE' });
  },
};
