'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { UserGrowthChart } from '@/components/dashboard/UserGrowthChart';

interface DashboardClientProps {
  userId: string;
  isAdmin: boolean;
}

export function DashboardClient({ userId, isAdmin }: DashboardClientProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s an overview of your platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/blogs/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* User Growth Chart */}
      <UserGrowthChart />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity limit={6} />
        </div>
      </div>
    </div>
  );
}
