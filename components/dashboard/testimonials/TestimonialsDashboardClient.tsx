'use client';

import { PlusCircle, RefreshCw, MessageSquareQuote, Eye, FileText, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { TestimonialsDataTable } from './TestimonialsDataTable';
import type { Testimonial } from '@/db/schema';
import { useMemo, useTransition } from 'react';

interface TestimonialsDashboardClientProps {
  initialData: Testimonial[];
}

export function TestimonialsDashboardClient({ initialData }: TestimonialsDashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const stats = useMemo(() => {
    const published = initialData.filter(t => t.published).length;
    const drafts = initialData.filter(t => !t.published).length;
    const featured = initialData.filter(t => t.featured).length;

    return { total: initialData.length, published, drafts, featured };
  }, [initialData]);

  const handleRefresh = () => {
    startTransition(() => { router.refresh(); });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">Manage testimonials displayed on your homepage.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isPending} className="gap-2 h-9">
            <RefreshCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => router.push('/dashboard/testimonials/new')} className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 shadow-sm">
            <PlusCircle className="h-3.5 w-3.5" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            <MessageSquareQuote className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All testimonials</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground mt-1">Live testimonials</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground mt-1">Unpublished</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Featured</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featured}</div>
            <p className="text-xs text-muted-foreground mt-1">Shown on homepage</p>
          </CardContent>
        </Card>
      </div>

      <TestimonialsDataTable data={initialData} />
    </div>
  );
}
