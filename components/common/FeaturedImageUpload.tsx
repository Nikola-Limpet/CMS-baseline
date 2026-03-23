'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, UploadIcon, X, Link } from 'lucide-react';
import { uploadToS3 } from '@/lib/utils/s3-client';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FeaturedImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function FeaturedImageUpload({ 
  value, 
  onChange, 
  disabled = false,
  className 
}: FeaturedImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync urlInput with value prop changes (for editing different posts)
  useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadToS3({ file, prefix: 'blog-images' });
      onChange(result.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    try {
      new URL(urlInput); // Validate URL format
      onChange(urlInput);
      toast.success('Image URL set successfully');
    } catch {
      toast.error('Please enter a valid URL');
    }
  };

  const removeImage = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Image Preview */}
      {value && (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-muted">
            <Image
              src={value}
              alt="Featured image preview"
              fill
              className="object-cover"
              onError={() => {
                toast.error('Failed to load image');
                onChange('');
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={removeImage}
                className="text-white bg-red-600 hover:bg-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Interface */}
      {!value && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'url')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <UploadIcon className="h-4 w-4" />
              <span>Upload File</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center space-x-2">
              <Link className="h-4 w-4" />
              <span>Image URL</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              className={cn(
                'border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-colors',
                'hover:border-muted-foreground/50 hover:bg-muted/50',
                isUploading && 'border-primary bg-primary/5'
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled || isUploading}
                className="hidden"
              />

              {isUploading ? (
                <div className="space-y-2">
                  <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Uploading image...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Drop an image here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports JPG, PNG, WebP. Max size 5MB.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                  >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={disabled}
                />
                <Button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={disabled || !urlInput.trim()}
                >
                  Set Image
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a direct link to an image file
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 