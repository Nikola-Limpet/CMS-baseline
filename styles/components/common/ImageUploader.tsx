'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper, { Area } from 'react-easy-crop';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Upload } from 'lucide-react';
import { uploadToS3 } from '@/lib/utils/s3-client';
import { cropImage, generateImageKey, optimizeImage } from '@/lib/utils/image-processing';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  aspectRatio?: number;
  prefix: string;
  className?: string;
  currentImageUrl?: string;
}

export function ImageUploader({
  onUploadComplete,
  aspectRatio = 16 / 9,
  prefix,
  className,
  currentImageUrl,
}: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (!image || !croppedAreaPixels) return;

    try {
      setIsUploading(true);

      // Convert base64 to file
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

      // Crop the image
      const croppedFile = await cropImage(file, croppedAreaPixels);

      // Optimize the cropped image
      const optimizedFile = await optimizeImage(croppedFile);

      // Generate a unique key for S3
      const key = generateImageKey(optimizedFile, prefix);

      // Upload to S3
      const { url } = await uploadToS3({
        file: optimizedFile,
        key,
      });

      onUploadComplete(url);
      setImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Show current image if exists and no new image is being processed */}
      {!image && currentImageUrl ? (
        <div className="space-y-3">
          <div 
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden" 
            style={{ aspectRatio: `${aspectRatio}` }}
          >
            <Image
              src={currentImageUrl}
              alt="Current image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                // Trigger file picker
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change Image
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onUploadComplete('')}
            >
              <X className="w-4 h-4 mr-2" />
              Remove Image
            </Button>
          </div>
        </div>
      ) : !image ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-300 hover:border-teal-500 hover:bg-gray-50'
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
            </p>
            <p className="text-xs text-gray-500">or click to select</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative h-[400px] w-full bg-black rounded-lg overflow-hidden">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Zoom</label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value: number[]) => setZoom(value[0])}
              className="w-full"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setImage(null)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
