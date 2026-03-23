'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ExternalLink,
  Heart,
  Bookmark,
  Share2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Info,
  Check,
  X,
  Loader2,
} from 'lucide-react';

// Enhanced interactive card
interface InteractiveCardProps {
  title: string;
  description?: string;
  image?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  href?: string;
  onClick?: () => void;
  actions?: React.ReactNode;
  stats?: { label: string; value: string | number; icon?: React.ReactNode }[];
  className?: string;
  style?: React.CSSProperties;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
  children?: React.ReactNode;
}

export function InteractiveCard({
  title,
  description,
  image,
  badge,
  badgeVariant = 'secondary',
  href,
  onClick,
  actions,
  stats,
  className,
  style,
  hoverEffect = 'lift',
  children,
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const hoverClasses = {
    lift: 'hover:translate-y-[-4px] hover:shadow-lg',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    scale: 'hover:scale-[1.02]',
    none: '',
  };

  const CardWrapper = href ? 'a' : 'div';

  return (
    <CardWrapper
      href={href}
      onClick={onClick}
      style={style}
      className={cn(
        'group block transition-all duration-300 cursor-pointer',
        hoverEffect !== 'none' && hoverClasses[hoverEffect],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden border-border/50 hover:border-border transition-colors">
        {image && (
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={image}
              alt={title}
              className={cn(
                'w-full h-full object-cover transition-transform duration-300',
                isHovered && 'scale-105'
              )}
            />
          </div>
        )}

        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              {badge && (
                <Badge variant={badgeVariant} className="text-xs">
                  {badge}
                </Badge>
              )}
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
            </div>
            {href && (
              <ExternalLink
                className={cn(
                  'w-4 h-4 text-muted-foreground transition-all duration-300',
                  isHovered && 'text-primary translate-x-1'
                )}
              />
            )}
          </div>

          {description && (
            <CardDescription className="text-sm leading-relaxed">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        {(stats || children || actions) && (
          <CardContent className="space-y-4">
            {children}

            {stats && stats.length > 0 && (
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-1">
                    {stat.icon}
                    <span className="font-medium text-foreground">
                      {stat.value}
                    </span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            {actions && (
              <div className="flex items-center justify-between pt-2 border-t">
                {actions}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </CardWrapper>
  );
}

// Action buttons for cards
interface CardActionsProps {
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  liked?: boolean;
  bookmarked?: boolean;
  likeCount?: number;
  className?: string;
}

export function CardActions({
  onLike,
  onBookmark,
  onShare,
  liked = false,
  bookmarked = false,
  likeCount,
  className,
}: CardActionsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {onLike && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          className={cn(
            'h-8 px-2 transition-colors',
            liked && 'text-destructive hover:text-destructive/80'
          )}
        >
          <Heart className={cn('w-4 h-4 mr-1', liked && 'fill-current')} />
          {likeCount !== undefined && (
            <span className="text-xs">{likeCount}</span>
          )}
        </Button>
      )}

      {onBookmark && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBookmark}
          className={cn(
            'h-8 px-2 transition-colors',
            bookmarked && 'text-primary hover:text-primary/80'
          )}
        >
          <Bookmark className={cn('w-4 h-4', bookmarked && 'fill-current')} />
        </Button>
      )}

      {onShare && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="h-8 px-2"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

// Progress card with animated progress bar
interface ProgressCardProps {
  title: string;
  description?: string;
  progress: number; // 0-100
  progressColor?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  icon?: React.ReactNode;
  className?: string;
}

export function ProgressCard({
  title,
  description,
  progress,
  progressColor = 'blue',
  icon,
  className,
}: ProgressCardProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const colorClasses = {
    blue: 'bg-primary',
    green: 'bg-green-500 dark:bg-green-600',
    yellow: 'bg-yellow-500 dark:bg-yellow-600',
    red: 'bg-destructive',
    purple: 'bg-purple-500 dark:bg-purple-600',
  };

  return (
    <Card className={cn('interactive-card', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000 ease-out',
                colorClasses[progressColor]
              )}
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Notification toast-like component
interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

export function Notification({
  type,
  title,
  description,
  action,
  onClose,
  autoClose = true,
  duration = 5000,
  className,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-destructive" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />,
    info: <Info className="w-5 h-5 text-primary" />,
  };

  const borderColors = {
    success: 'border-l-green-500 dark:border-l-green-400',
    error: 'border-l-red-500 dark:border-l-red-400',
    warning: 'border-l-yellow-500 dark:border-l-yellow-400',
    info: 'border-l-primary',
  };

  if (!isVisible) return null;

  return (
    <Card
      className={cn(
        'border-l-4 shadow-lg transition-all duration-300',
        borderColors[type],
        isVisible ? 'scale-in' : 'scale-95 opacity-0',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {icons[type]}
          <div className="flex-1 space-y-1">
            <h4 className="font-medium text-sm">{title}</h4>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {action && (
              <Button
                size="sm"
                variant="outline"
                onClick={action.onClick}
                className="h-8 text-xs"
              >
                {action.label}
              </Button>
            )}
            {onClose && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => onClose(), 300);
                }}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced stats card with animation
interface AnimatedStatCardProps {
  title: string;
  value: number;
  unit?: string;
  change?: {
    value: number;
    label: string;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'teal' | 'amber';
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedStatCard({
  title,
  value,
  unit,
  change,
  icon,
  color = 'blue',
  className,
  style
}: AnimatedStatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1500;
      const increment = value / (duration / 16);
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(counter);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-900',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-900',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-900',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-900',
    teal: 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 text-teal-900',
    amber: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-900',
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer',
        colorClasses[color],
        className
      )}
      style={style}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <div className="flex items-baseline space-x-1">
            <motion.span
              className="text-3xl font-bold"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              {displayValue.toLocaleString()}
            </motion.span>
            {unit && (
              <span className="text-sm font-medium opacity-70">{unit}</span>
            )}
          </div>
          {change && (
            <motion.div
              className={cn(
                'flex items-center space-x-1 text-xs font-medium',
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span>{change.type === 'increase' ? '↗' : '↘'}</span>
              <span>+{change.value}% {change.label}</span>
            </motion.div>
          )}
        </div>
        <motion.div
          className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Quick action button with loading state
interface QuickActionButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  badge?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function QuickActionButton({
  title,
  description,
  icon,
  onClick,
  loading = false,
  badge,
  className,
  style,
}: QuickActionButtonProps) {
  return (
    <motion.button
      className={cn(
        'group relative p-2 text-left border border-border rounded-xl bg-card hover:bg-accent transition-all duration-300 w-full',
        'hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30',
        loading && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={style}
      onClick={!loading ? onClick : undefined}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
    >
      {badge && (
        <motion.div
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          {badge}
        </motion.div>
      )}
      
      <div className="flex items-start space-x-3">
        <motion.div
          className="text-2xl text-primary group-hover:text-primary-foreground transition-colors"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {loading ? <LoadingSpinner size="sm" /> : icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        </div>
        <motion.div
          className="text-muted-foreground group-hover:text-primary transition-colors"
          initial={{ x: -5, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.div>
      </div>
    </motion.button>
  );
}

// Empty state component for when no content is available
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: () => void;
  actionText?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  actionText,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-6 px-4 text-center',
        className
      )}
    >
      <div className="w-12 h-12 mb-2 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        {icon || <Eye className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {description}
        </p>
      )}
      {action && actionText && (
        <Button onClick={action} variant="outline" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}

// Error state component for error scenarios
interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryText = 'Try again',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-destructive/5 flex items-center justify-center text-destructive">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {description}
        </p>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          {retryText}
        </Button>
      )}
    </div>
  );
}

// Loading button with spinner
interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LoadingButton({
  loading = false,
  loadingText,
  icon,
  children,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}

// Progress indicator for multi-step workflows
interface ProgressIndicatorProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({
  steps,
  currentStep,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                index < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStep
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {index < currentStep ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-12 mx-2 transition-colors',
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div
              className={cn(
                'font-medium transition-colors',
                index <= currentStep
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {step.label}
            </div>
            {step.description && (
              <div className="text-xs text-muted-foreground mt-1">
                {step.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', color = 'currentColor', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <motion.div
      className={cn(sizes[size], className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="h-full w-full" style={{ color }} />
    </motion.div>
  );
}

// Skeleton loader
interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
}

export function SkeletonLoader({ className, lines = 3, avatar = false }: SkeletonLoaderProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="flex items-start space-x-4">
        {avatar && (
          <div className="rounded-full bg-gray-200 h-12 w-12 flex-shrink-0"></div>
        )}
        <div className="flex-1 space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <motion.div
              key={i}
              className="h-4 bg-gray-200 rounded"
              style={{ width: `${Math.random() * 40 + 60}%` }}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Progress bar
interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  size = 'md',
  color = 'blue',
  showPercentage = true,
  animated = true,
  className
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {showPercentage && (
        <div className="flex justify-between text-sm font-medium">
          <span>Progress</span>
          <span>{Math.round(displayProgress)}%</span>
        </div>
      )}
      <div className={cn('bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className={cn('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Interactive card
interface MotionWrapperProps {
  children: React.ReactNode;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MotionWrapper({
  children,
  hover = true,
  clickable = false,
  onClick,
  className
}: MotionWrapperProps) {
  return (
    <motion.div
      className={cn(
        'rounded-xl border bg-card p-6 shadow-sm transition-all duration-300',
        hover && 'hover:shadow-lg hover:shadow-primary/5',
        clickable && 'cursor-pointer hover:border-primary/30',
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      onClick={clickable ? onClick : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Fade in animation
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function FadeIn({ children, delay = 0, direction = 'up', className }: FadeInProps) {
  const directions = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children
interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerChildren({ children, className, staggerDelay = 0.1 }: StaggerChildrenProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.5 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Notification toast
interface NotificationToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function NotificationToast({
  type,
  title,
  message,
  onClose,
  duration = 5000
}: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <Check className="h-5 w-5" />,
    error: <X className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  return (
    <motion.div
      className={cn(
        'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border',
        colors[type]
      )}
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-sm opacity-80">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <motion.div
        className="h-1 bg-current opacity-30"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}
