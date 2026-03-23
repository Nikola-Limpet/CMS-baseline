'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  quality?: number;
}

export function ResponsiveImage({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  fill = false,
  width,
  height,
  quality = 75,
}: ResponsiveImageProps) {
  // If the image is from S3, we can generate different sizes
  const isS3Image = src.includes('amazonaws.com');

  // Common props for both S3 and non-S3 images
  const commonProps = {
    className: cn(
      'object-cover transition-opacity duration-300',
      fill && 'absolute inset-0',
      className
    ),
    sizes,
    priority,
    quality,
  };

  // If fill is true, we don't pass width and height
  const dimensionProps = fill
    ? {}
    : {
        width: width || 1920,
        height: height || 1080,
      };

  if (isS3Image) {
    // For S3 images, we can optimize them on the fly using query parameters
    // This assumes your S3 bucket is configured with a CDN that supports image optimization
    return (
      <Image
        src={src}
        alt={alt}
        {...commonProps}
        {...dimensionProps}
        blurDataURL={`${src}?w=50&q=10`} // Low quality placeholder
        placeholder="blur"
      />
    );
  }

  // For non-S3 images, use standard Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      {...commonProps}
      {...dimensionProps}
    />
  );
}
