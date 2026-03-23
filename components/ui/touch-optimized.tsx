"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

// Touch-optimized button with minimum 44px touch target
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  touchFeedback?: boolean;
}

export function TouchButton({
  variant = 'default',
  size = 'md',
  children,
  fullWidth = false,
  touchFeedback = true,
  className,
  ...props
}: TouchButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'h-11 px-4 text-sm', // Minimum 44px height for touch
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20',
    ghost: 'text-primary hover:bg-primary/10 active:bg-primary/20',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
  };

  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'select-none touch-manipulation', // Prevent zoom on touch
        
        // Size classes
        sizeClasses[size],
        
        // Variant classes
        variantClasses[variant],
        
        // Full width
        fullWidth && 'w-full',
        
        // Touch feedback
        touchFeedback && isPressed && 'scale-95',
        
        className
      )}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </button>
  );
}

// Swipeable card component for mobile lists
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: React.ElementType;
    label: string;
    color: 'green' | 'blue' | 'red' | 'gray';
  };
  rightAction?: {
    icon: React.ElementType;
    label: string;
    color: 'green' | 'blue' | 'red' | 'gray';
  };
  className?: string;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className,
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    red: 'bg-red-500 text-white',
    gray: 'bg-gray-500 text-white',
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      
      // Limit swipe distance
      const maxSwipe = 100;
      const clampedDiffX = Math.max(-maxSwipe, Math.min(maxSwipe, diffX));
      setTranslateX(clampedDiffX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      
      // Trigger action if swiped far enough
      if (Math.abs(translateX) > 50) {
        if (translateX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (translateX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      
      // Reset position
      setTranslateX(0);
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('touchstart', handleTouchStart);
      card.addEventListener('touchmove', handleTouchMove);
      card.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (card) {
        card.removeEventListener('touchstart', handleTouchStart);
        card.removeEventListener('touchmove', handleTouchMove);
        card.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isDragging, startX, translateX, onSwipeLeft, onSwipeRight]);

  return (
    <div className="relative overflow-hidden">
      {/* Left action */}
      {leftAction && (
        <div
          className={cn(
            'absolute inset-y-0 left-0 flex items-center justify-center w-20 transition-opacity',
            colorClasses[leftAction.color],
            translateX > 20 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="text-center">
            <leftAction.icon className="h-6 w-6 mx-auto mb-1" />
            <span className="text-xs font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Right action */}
      {rightAction && (
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex items-center justify-center w-20 transition-opacity',
            colorClasses[rightAction.color],
            translateX < -20 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="text-center">
            <rightAction.icon className="h-6 w-6 mx-auto mb-1" />
            <span className="text-xs font-medium">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Card content */}
      <Card
        ref={cardRef}
        className={cn(
          'transition-transform duration-150 ease-out cursor-grab active:cursor-grabbing',
          isDragging && 'shadow-lg',
          className
        )}
        style={{
          transform: `translateX(${translateX}px)`,
        }}
      >
        {children}
      </Card>
    </div>
  );
}

// Mobile-optimized tabs with swipe navigation
interface MobileTabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function MobileTabs({
  tabs,
  defaultTab,
  onTabChange,
  className,
}: MobileTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleSwipeLeft = () => {
    if (currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1].id);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1].id);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Headers - Horizontally scrollable on mobile */}
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 -mb-px">
          <div className="flex space-x-1 min-w-max px-4 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'relative min-w-0 flex-1 whitespace-nowrap py-3 px-4 text-sm font-medium transition-colors',
                  'border-b-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  'touch-manipulation select-none',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
                style={{ minHeight: '44px' }} // Touch target
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation arrows for large screens */}
        <div className="hidden sm:flex absolute inset-y-0 left-0 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwipeRight}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="hidden sm:flex absolute inset-y-0 right-0 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwipeLeft}
            disabled={currentIndex === tabs.length - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Content - Swipeable on mobile */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${tabs.length * 100}%`,
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            setStartX(e.touches[0].clientX);
          }}
          onTouchMove={(_e) => {
            if (!isDragging) return;
            // Add visual feedback during swipe if needed
          }}
          onTouchEnd={(e) => {
            if (!isDragging) return;
            setIsDragging(false);
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            // Minimum swipe distance
            if (Math.abs(diffX) > 50) {
              if (diffX > 0) {
                handleSwipeLeft();
              } else {
                handleSwipeRight();
              }
            }
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="w-full flex-shrink-0 p-4"
              style={{ width: `${100 / tabs.length}%` }}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>

      {/* Swipe indicator dots for mobile */}
      <div className="flex justify-center mt-4 sm:hidden">
        <div className="flex space-x-2">
          {tabs.map((_, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(tabs[index].id)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Pull-to-refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxPullDistance = 100;
  const triggerDistance = 60;

  useEffect(() => {
    let startY = 0;
    let isAtTop = false;

    const handleTouchStart = (e: TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      isAtTop = container.scrollTop === 0;
      if (isAtTop) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isAtTop || isRefreshing) return;
      
      const currentY = e.touches[0].clientY;
      const diffY = currentY - startY;
      
      if (diffY > 0) {
        e.preventDefault();
        setIsPulling(true);
        setPullDistance(Math.min(diffY * 0.5, maxPullDistance));
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling && pullDistance >= triggerDistance && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setIsPulling(false);
      setPullDistance(0);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isPulling, pullDistance, isRefreshing, onRefresh]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-auto h-full', className)}
      style={{
        paddingTop: isPulling || isRefreshing ? pullDistance : 0,
        transition: isPulling ? 'none' : 'padding-top 0.3s ease-out',
      }}
    >
      {/* Pull indicator */}
      {(isPulling || isRefreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary/10 text-primary"
          style={{
            height: Math.max(pullDistance, 40),
            transform: `translateY(-${Math.max(pullDistance, 40)}px)`,
          }}
        >
          <div className="text-center">
            {isRefreshing ? (
              <>
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                <span className="text-sm font-medium">Refreshing...</span>
              </>
            ) : pullDistance >= triggerDistance ? (
              <>
                <Check className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm font-medium">Release to refresh</span>
              </>
            ) : (
              <>
                <ChevronLeft className="w-6 h-6 mx-auto mb-1 rotate-90" />
                <span className="text-sm font-medium">Pull to refresh</span>
              </>
            )}
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
} 