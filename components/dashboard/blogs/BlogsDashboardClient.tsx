'use client';

import { PlusCircle, RefreshCw, FileText, Eye, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { BlogsDataTable } from '@/components/dashboard/blogs/BlogsDataTable';
import { type BlogPost } from '@/db/schema';
import { useMemo, useTransition } from 'react';

interface BlogsDashboardClientProps {
  initialData: BlogPost[];
}

export function BlogsDashboardClient({ initialData }: BlogsDashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const stats = useMemo(() => {
    const published = initialData.filter(post => post.published).length;
    const drafts = initialData.filter(post => !post.published).length;
    const recentPosts = initialData.filter(post => {
      const postDate = new Date(post.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return postDate >= weekAgo;
    }).length;

    return { total: initialData.length, published, drafts, recentPosts };
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and manage your educational content.</p>
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
            onClick={() => router.push('/dashboard/blogs/new')}
            className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All blog posts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground mt-1">Live posts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground mt-1">Unpublished posts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recent</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">Posts this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Table */}
      <BlogsDataTable data={initialData} />
    </div>
  );
}
