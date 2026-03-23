'use client';

import React, { useState } from 'react';
import { Users, FileText } from 'lucide-react';
import {
  QuickActionButton,
  FadeIn,
  StaggerChildren,
} from '@/components/ui/interactive-elements';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {
  className?: string;
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
    <FadeIn direction="up" delay={0.1} className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <span className="text-sm text-gray-500">Get started</span>
        </div>

        <StaggerChildren
          staggerDelay={0.05}
          className="grid grid-cols-2 gap-3"
        >
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
        </StaggerChildren>
      </div>
    </FadeIn>
  );
}
