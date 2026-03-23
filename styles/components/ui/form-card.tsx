import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FormCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FormCard({ 
  title, 
  description, 
  children, 
  className,
  contentClassName 
}: FormCardProps) {
  return (
    <Card className={cn(
      "bg-white border border-gray-200 shadow-sm",
      className
    )}>
      {(title || description) && (
        <CardHeader className="pb-6">
          {title && (
            <CardTitle className="text-xl font-semibold text-gray-900 font-poppins">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-gray-600 font-inter leading-relaxed">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(
        "space-y-6",
        contentClassName
      )}>
        {children}
      </CardContent>
    </Card>
  );
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 font-poppins">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 font-inter">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

interface FormGridProps {
  columns?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

export function FormGrid({ columns = 2, children, className }: FormGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn(
      "grid gap-4",
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={cn(
      "flex items-center gap-3 pt-6 border-t border-gray-200",
      alignmentClasses[align],
      className
    )}>
      {children}
    </div>
  );
} 