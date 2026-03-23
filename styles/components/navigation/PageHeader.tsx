'use client';

import React from 'react';
import { Breadcrumbs, DashboardBreadcrumbs } from './Breadcrumbs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title?: string;
  description?: string;
  className?: string;
  showBreadcrumbs?: boolean;
  showSearch?: boolean;
  isDashboard?: boolean;
  actions?: React.ReactNode;
  refreshAction?: () => void;
  isRefreshing?: boolean;
  createAction?: () => void;
  createLabel?: string;
  settingsAction?: () => void;
}

export function PageHeader({
  title,
  description,
  className,
  showBreadcrumbs = true,
  showSearch: _showSearch = true,
  isDashboard = false,
  actions,
  refreshAction,
  isRefreshing = false,
  createAction,
  createLabel = 'Create New',
  settingsAction,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="container mx-auto px-4  space-y-6">
        {/* Top Row - Breadcrumbs and Search */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {showBreadcrumbs && (
              <>
                {isDashboard ? (
                  <DashboardBreadcrumbs className="mb-2" />
                ) : (
                  <Breadcrumbs className="mb-2" />
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom Row - Title, Description, and Actions */}
        {(title ||
          description ||
          actions ||
          refreshAction ||
          createAction ||
          settingsAction) && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && (
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-muted-foreground mt-2 max-w-2xl text-lg leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {(actions || refreshAction || createAction || settingsAction) && (
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Refresh Action */}
                {refreshAction && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshAction}
                    disabled={isRefreshing}
                    className="h-10 border-neutral-300 hover:border-primary-blue hover:text-primary-blue transition-colors"
                  >
                    <RefreshCw
                      className={cn(
                        'h-4 w-4 mr-2',
                        isRefreshing && 'animate-spin'
                      )}
                    />
                    Refresh
                  </Button>
                )}

                {/* Settings Action */}
                {settingsAction && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={settingsAction}
                    className="h-10 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                )}

                {/* Create Action */}
                {createAction && (
                  <Button
                    size="sm"
                    onClick={createAction}
                    className="h-10 bg-primary-blue hover:bg-primary-blue/90 text-white font-medium shadow-sm transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {createLabel}
                  </Button>
                )}

                {/* Custom Actions */}
                {actions}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Specialized header for dashboard pages
export function DashboardHeader({
  title,
  description,
  className,
  ...props
}: Omit<PageHeaderProps, 'isDashboard'>) {
  return (
    <PageHeader
      title={title}
      description={description}
      className={className}
      isDashboard={true}
      {...props}
    />
  );
}

// Quick header variants for common use cases
export function BlogHeader({
  onCreatePost,
  onRefresh,
  isRefreshing,
}: {
  onCreatePost?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <DashboardHeader
      title="Blog Management"
      description="Create and manage blog posts, articles, and educational content"
      showBreadcrumbs={false}
      createAction={onCreatePost}
      createLabel="New Post"
      refreshAction={onRefresh}
      isRefreshing={isRefreshing}
    />
  );
}

export function EventHeader({
  onCreateEvent,
  onRefresh,
  isRefreshing,
}: {
  onCreateEvent?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <DashboardHeader
      title="Event Management"
      description="Manage competitions, events, and important announcements"
      showBreadcrumbs={false}
      createAction={onCreateEvent}
      createLabel="New Event"
      refreshAction={onRefresh}
      isRefreshing={isRefreshing}
    />
  );
}

export function UserHeader({
  onRefresh,
  isRefreshing,
}: {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <DashboardHeader
      title="User Management"
      description="Manage user accounts, roles, and permissions"
      showBreadcrumbs={false}
      refreshAction={onRefresh}
      isRefreshing={isRefreshing}
    />
  );
}
