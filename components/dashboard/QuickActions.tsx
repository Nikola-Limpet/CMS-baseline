'use client';

import React, { useState } from 'react';
import { Users, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  className?: string;
}

function QuickActionButton({
  title,
  description,
  icon,
  onClick,
  loading,
  className,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        'flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-all',
        'hover:bg-accent hover:shadow-sm active:scale-[0.98]',
        'disabled:opacity-60 disabled:pointer-events-none',
        className
      )}
    >
      <div className="flex items-center gap-2 text-primary">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      <span className="text-xs text-muted-foreground">{description}</span>
    </button>
  );
}

export function QuickActions({ className }: QuickActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (actionId: string, path: string) => {
    setLoadingAction(actionId);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoadingAction(null);
    router.push(path);
  };

  const actions = [
    {
      id: 'write-blog',
      title: 'Write Blog Post',
      description: 'Create new content',
      icon: <FileText className="h-4 w-4" />,
      onClick: () => handleAction('write-blog', '/dashboard/blogs/new'),
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'View and manage users',
      icon: <Users className="h-4 w-4" />,
      onClick: () => handleAction('manage-users', '/dashboard/users'),
    },
  ];

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <span className="text-sm text-muted-foreground">Get started</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {actions.map(action => (
            <QuickActionButton
              key={action.id}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onClick={action.onClick}
              loading={loadingAction === action.id}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
