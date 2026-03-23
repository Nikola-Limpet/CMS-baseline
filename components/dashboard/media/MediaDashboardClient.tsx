'use client';

import { useState, useRef, useTransition } from 'react';
import { RefreshCw, ImageIcon, HardDrive, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MediaGrid } from './MediaGrid';
import { mediaApi } from '@/lib/api/media';
import { uploadToS3 } from '@/lib/utils/s3-client';
import type { MediaAsset } from '@/db/schema';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

interface MediaDashboardClientProps {
  initialData: MediaAsset[];
  stats: { count: number; totalSize: number };
}

export function MediaDashboardClient({ initialData, stats }: MediaDashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = search
    ? initialData.filter(a => a.filename.toLowerCase().includes(search.toLowerCase()))
    : initialData;

  const imageCount = initialData.filter(a => a.mimeType.startsWith('image/')).length;

  const handleRefresh = () => {
    startTransition(() => { router.refresh(); });
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`"${file.name}" exceeds 10MB limit`);
          continue;
        }

        const result = await uploadToS3({ file, prefix: 'media' });

        await mediaApi.create({
          filename: file.name,
          s3_key: result.key || `media/${file.name}`,
          url: result.url,
          mime_type: file.type,
          size: file.size,
        });
      }

      toast.success(`${files.length} file(s) uploaded`);
      router.refresh();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">Manage uploaded images and files.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isPending} className="gap-2 h-9">
            <RefreshCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            Upload
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Assets</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.count}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imageCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Size</CardTitle>
            <HardDrive className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input
          placeholder="Search by filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Grid */}
      <MediaGrid assets={filteredAssets} />
    </div>
  );
}
