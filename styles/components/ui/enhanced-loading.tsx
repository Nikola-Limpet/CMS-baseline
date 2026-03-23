'use client';

import React from 'react';
import { Loader2, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Enhanced Skeleton with shimmer effect
export function ShimmerSkeleton({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/50 rounded-md",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "before:animate-[shimmer_2s_infinite]",
        className
      )}
      {...props}
    />
  );
}

// Animated pulse loader
export function PulseLoader({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-primary border-t-transparent",
        sizeClasses[size]
      )} />
    </div>
  );
}

// Dots loader
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Comprehensive loading card
interface LoadingCardProps {
  title?: string;
  description?: string;
  type?: 'spinner' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingCard({ 
  title = "Loading...",
  description = "Please wait while we fetch your data",
  type = 'spinner',
  size = 'md',
  className
}: LoadingCardProps) {
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader size={size} />;
      default:
        return <Loader2 className={cn(
          "animate-spin text-primary",
          size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
        )} />;
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
        {renderLoader()}
        <div className="text-center space-y-2">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced button with loading states
interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  successIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  state?: 'idle' | 'loading' | 'success' | 'error';
}

export function LoadingButton({
  children,
  isLoading = false,
  loadingText,
  icon,
  successIcon = <CheckCircle className="w-4 h-4" />,
  errorIcon = <XCircle className="w-4 h-4" />,
  state = 'idle',
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  const renderIcon = () => {
    if (state === 'loading' || isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    if (state === 'success') {
      return successIcon;
    }
    if (state === 'error') {
      return errorIcon;
    }
    return icon;
  };

  const renderText = () => {
    if (state === 'loading' || isLoading) {
      return loadingText || 'Loading...';
    }
    if (state === 'success') {
      return 'Success!';
    }
    if (state === 'error') {
      return 'Try Again';
    }
    return children;
  };

  const getStateClasses = () => {
    switch (state) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'error':
        return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground';
      default:
        return '';
    }
  };

  return (
    <Button
      disabled={disabled || state === 'loading' || isLoading}
      className={cn(getStateClasses(), className)}
      {...props}
    >
      {renderIcon() && (
        <span className="mr-2">
          {renderIcon()}
        </span>
      )}
      {renderText()}
    </Button>
  );
}

// Table loading skeleton
export function TableLoadingSkeleton({ 
  columns = 5, 
  rows = 5,
  showHeader = true 
}: { 
  columns?: number; 
  rows?: number;
  showHeader?: boolean;
}) {
  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <ShimmerSkeleton className="h-8 w-[200px]" />
          <ShimmerSkeleton className="h-10 w-[120px]" />
        </div>
      )}
      <div className="border rounded-lg overflow-hidden">
        {showHeader && (
          <div className="border-b bg-muted/30 p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, i) => (
                <ShimmerSkeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        )}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="p-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <ShimmerSkeleton 
                    key={colIndex} 
                    className={cn(
                      "h-4",
                      colIndex === 0 ? "w-full" : "w-3/4" // First column wider
                    )} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Card grid loading skeleton
export function CardGridLoadingSkeleton({ 
  columns = 3, 
  count = 6 
}: { 
  columns?: number; 
  count?: number;
}) {
  return (
    <div 
      className="grid gap-6"
      style={{ 
        gridTemplateColumns: `repeat(${Math.min(columns, 3)}, minmax(0, 1fr))` 
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="space-y-3">
            <ShimmerSkeleton className="h-6 w-3/4" />
            <ShimmerSkeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <ShimmerSkeleton className="h-4 w-full" />
            <ShimmerSkeleton className="h-4 w-2/3" />
            <ShimmerSkeleton className="h-8 w-[100px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Stats loading skeleton
export function StatsLoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <ShimmerSkeleton className="h-4 w-[120px]" />
              <ShimmerSkeleton className="h-4 w-4 rounded" />
            </div>
            <div className="space-y-2">
              <ShimmerSkeleton className="h-8 w-[80px]" />
              <ShimmerSkeleton className="h-3 w-[100px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Progress indicator
interface ProgressIndicatorProps {
  steps: { label: string; completed: boolean }[];
  currentStep?: number;
  className?: string;
}

export function ProgressIndicator({ 
  steps, 
  currentStep = 0,
  className 
}: ProgressIndicatorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center space-y-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                step.completed 
                  ? "bg-green-600 text-white" 
                  : index === currentStep 
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : "bg-muted text-muted-foreground"
              )}>
                {step.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={cn(
                "text-xs text-center max-w-[80px]",
                step.completed || index === currentStep 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 transition-all",
                step.completed ? "bg-green-600" : "bg-muted"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Error state component
interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error while loading your data.",
  retry,
  retryText = "Try Again",
  className
}: ErrorStateProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle className="w-6 h-6 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
        {retry && (
          <LoadingButton 
            onClick={retry}
            variant="outline"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            {retryText}
          </LoadingButton>
        )}
      </CardContent>
    </Card>
  );
}

// Empty state component
interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: () => void;
  actionText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No data found",
  description = "There's nothing to show here yet.",
  action,
  actionText = "Get Started",
  icon = <AlertCircle className="w-6 h-6 text-muted-foreground" />,
  className
}: EmptyStateProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
        {action && (
          <Button onClick={action}>
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}