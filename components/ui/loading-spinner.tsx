'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
  className?: string;
  overlay?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8 border-2',
  md: 'h-12 w-12 border-3',
  lg: 'h-16 w-16 border-4',
  xl: 'h-20 w-20 border-4',
};

export function LoadingSpinner({
  size = 'lg',
  text = 'Loading...',
  subtext,
  fullScreen = false,
  className,
  overlay = false,
}: LoadingSpinnerProps) {
  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-4',
    {
      'fixed inset-0 z-50': fullScreen,
      'bg-white/80 backdrop-blur-sm': fullScreen && overlay,
      'min-h-[400px]': !fullScreen,
    },
    className
  );

  const spinnerClasses = cn(
    'animate-spin rounded-full border-gray-200',
    sizeClasses[size]
  );

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Outer ring */}
        <div className={spinnerClasses}></div>
        {/* Inner spinning border */}
        <div
          className={cn(
            'absolute inset-0 animate-spin rounded-full border-transparent border-t-brand-blue-600',
            sizeClasses[size]
          )}
        ></div>
      </div>
      {(text || subtext) && (
        <div className="text-center">
          {text && (
            <p className="text-sm text-gray-600 font-medium">{text}</p>
          )}
          {subtext && (
            <p className="text-xs text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
      )}
    </div>
  );
}