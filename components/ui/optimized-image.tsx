'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallback?: string;
  showLoadingState?: boolean;
  loadingClassName?: string;
  errorClassName?: string;
  aspectRatio?: 'square' | 'video' | 'photo' | 'wide' | 'tall';
  priority?: boolean;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video', // 16:9
  photo: 'aspect-[4/3]',
  wide: 'aspect-[21/9]',
  tall: 'aspect-[3/4]',
};

// Default dimensions for different aspect ratios
const aspectRatioDimensions = {
  square: { width: 400, height: 400 },
  video: { width: 640, height: 360 }, // 16:9
  photo: { width: 400, height: 300 }, // 4:3
  wide: { width: 800, height: 343 }, // 21:9
  tall: { width: 300, height: 400 }, // 3:4
};

export function OptimizedImage({
  src,
  alt,
  className,
  fallback = '/images/placeholder-image.jpg',
  showLoadingState = true,
  loadingClassName,
  errorClassName,
  aspectRatio,
  priority = false,
  width,
  height,
  fill,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
      setHasError(false);
    }
  };

  // Determine image dimensions
  const getImageProps = () => {
    // If fill is explicitly provided, use it
    if (fill) {
      return { fill: true };
    }
    
    // If width and height are provided, use them
    if (width && height) {
      return { width, height };
    }
    
    // If aspectRatio is provided, use default dimensions
    if (aspectRatio && aspectRatioDimensions[aspectRatio]) {
      return aspectRatioDimensions[aspectRatio];
    }
    
    // Default fallback dimensions
    return { width: 400, height: 300 };
  };

  const imageProps = getImageProps();

  const baseClassName = cn(
    'transition-all duration-300',
    aspectRatio && aspectRatioClasses[aspectRatio],
    isLoading && showLoadingState && 'animate-pulse bg-muted',
    hasError && 'opacity-50',
    className
  );

  return (
    <div className={cn('relative overflow-hidden', baseClassName)}>
      <Image
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading && showLoadingState ? 'opacity-0' : 'opacity-100',
          hasError && errorClassName,
          !aspectRatio && !fill && 'w-full h-full'
        )}
        {...imageProps}
        {...props}
      />
      
      {/* Loading state */}
      {isLoading && showLoadingState && (
        <div className={cn(
          'absolute inset-0 bg-muted animate-pulse flex items-center justify-center',
          loadingClassName
        )}>
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className={cn(
          'absolute inset-0 bg-muted/50 flex items-center justify-center',
          errorClassName
        )}>
          <div className="text-center p-4">
            <div className="w-8 h-8 mx-auto mb-2 text-muted-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Higher-order component for lazy loading images
export function withLazyLoading<T extends React.ComponentType<any>>(
  Component: T,
  threshold = '100px'
) {
  return function LazyImageWrapper(props: React.ComponentProps<T>) {
    const [isInView, setIsInView] = useState(false);
    const [ref, setRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!ref || typeof window === 'undefined') return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: threshold,
        }
      );

      observer.observe(ref);

      return () => observer.disconnect();
    }, [ref, threshold]);

    return (
      <div ref={setRef}>
        {isInView ? (
          <Component {...props} />
        ) : (
          <div className="bg-muted animate-pulse w-full h-40" />
        )}
      </div>
    );
  };
}

export default OptimizedImage; 