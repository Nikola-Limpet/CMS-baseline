'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Trash2, Copy, FileImage, FileText, Film } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { mediaApi } from '@/lib/api/media';
import type { MediaAsset } from '@/db/schema';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return FileImage;
  if (mimeType.startsWith('video/')) return Film;
  return FileText;
}

interface MediaGridProps {
  assets: MediaAsset[];
}

export function MediaGrid({ assets }: MediaGridProps) {
  const router = useRouter();

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleDelete = async (asset: MediaAsset) => {
    try {
      await mediaApi.delete(asset.id);
      toast.success(`"${asset.filename}" deleted`);
      router.refresh();
    } catch {
      toast.error('Failed to delete asset');
    }
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
          <FileImage className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No media assets</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Upload images through blog or event editors to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {assets.map((asset) => {
        const isImage = asset.mimeType.startsWith('image/');
        const Icon = getFileIcon(asset.mimeType);

        return (
          <div
            key={asset.id}
            className="group relative rounded-lg border border-border overflow-hidden bg-muted/30 hover:border-primary/30 hover:shadow-md transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-square">
              {isImage ? (
                <Image
                  src={asset.url}
                  alt={asset.altText || asset.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Icon className="w-10 h-10 text-muted-foreground/40" />
                </div>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => handleCopyUrl(asset.url)}
                  title="Copy URL"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(asset)}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="p-2">
              <p className="text-xs font-medium truncate" title={asset.filename}>
                {asset.filename}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">
                  {formatFileSize(asset.size)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(asset.createdAt), 'MMM d')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
