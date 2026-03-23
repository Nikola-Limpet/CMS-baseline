'use client';

import { PlusCircle, RefreshCw, CalendarDays, Eye, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { EventsDataTable, type EventRow } from '@/components/dashboard/events/EventsDataTable';
import { useMemo, useTransition } from 'react';

interface EventsDashboardClientProps {
  initialData: EventRow[];
}

export function EventsDashboardClient({ initialData }: EventsDashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const stats = useMemo(() => {
    const now = new Date();
    const published = initialData.filter(e => e.published).length;
    const drafts = initialData.filter(e => !e.published).length;
    const upcoming = initialData.filter(e => e.published && new Date(e.eventDate) >= now).length;

    return { total: initialData.length, published, drafts, upcoming };
  }, [initialData]);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Event Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and manage your events.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="gap-2 h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => router.push('/dashboard/events/new')}
            className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            New Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All events</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground mt-1">Live events</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground mt-1">Unpublished events</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground mt-1">Future events</p>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <EventsDataTable data={initialData} />
    </div>
  );
}
