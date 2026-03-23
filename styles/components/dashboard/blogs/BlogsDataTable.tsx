'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { 
  ArrowUpDown,
  Calendar,
  ExternalLink, 
  Edit,
  Trash2,
  Eye,
  FileText,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { SimpleDataTable } from '@/components/ui/simple-data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { blogsApi } from '@/lib/api/blogs';

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
};

interface BlogsDataTableProps {
  data: BlogPost[];
  isLoading?: boolean;
}

export function BlogsDataTable({ data, isLoading = false }: BlogsDataTableProps) {
  const router = useRouter();

  const handleDelete = async (post: BlogPost) => {
    try {
      await blogsApi.posts.delete(post.id);
      toast.success(`Post "${post.title}" deleted successfully`);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  };

  const columns: ColumnDef<BlogPost>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="max-w-[300px] md:max-w-[300px]">
            <div className="font-medium truncate" title={post.title}>
              {post.title}
            </div>
            {post.excerpt && (
              <div className="text-sm text-muted-foreground truncate mt-1" title={post.excerpt}>
                {post.excerpt}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'published',
      header: 'Status',
      cell: ({ row }) => {
        const published = row.getValue('published') as boolean;
        return (
          <Badge 
            variant={published ? 'default' : 'secondary'}
          >
            {published ? 'Published' : 'Draft'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as Date;
        return (
          <div className="text-sm text-muted-foreground">
            {format(new Date(date), 'MMM d, yyyy')}
          </div>
        );
      },
    },
    {
      accessorKey: 'publishedAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3"
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('publishedAt') as Date | null;
        return (
          <div className="text-sm text-muted-foreground">
            {date ? format(new Date(date), 'MMM d, yyyy') : '—'}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const post = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center cursor-pointer"
                  target="_blank"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Post
                  <ExternalLink className="ml-auto h-3 w-3" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/blogs/${post.id}/edit`}
                  className="flex items-center cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(post)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
        <FileText className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No blog posts found</h3>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">
        Get started by creating your first blog post to share knowledge with your students.
      </p>
      <div className="mt-6">
        <Link href="/dashboard/blogs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Blog Post
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <SimpleDataTable
      columns={columns}
      data={data}
      searchKey="title"
      searchPlaceholder="Search blog posts..."
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
}