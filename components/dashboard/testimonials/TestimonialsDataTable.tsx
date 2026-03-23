'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  Edit,
  Trash2,
  Star,
  Plus,
  MessageSquareQuote,
} from 'lucide-react';
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
import { testimonialsApi } from '@/lib/api/testimonials';
import type { Testimonial } from '@/db/schema';

interface TestimonialsDataTableProps {
  data: Testimonial[];
}

export function TestimonialsDataTable({ data }: TestimonialsDataTableProps) {
  const router = useRouter();

  const handleDelete = async (item: Testimonial) => {
    try {
      await testimonialsApi.delete(item.id);
      toast.success(`Testimonial by "${item.authorName}" deleted`);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const columns: ColumnDef<Testimonial>[] = [
    {
      accessorKey: 'authorName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3"
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <div className="font-medium">{item.authorName}</div>
            {item.authorTitle && (
              <div className="text-sm text-muted-foreground">{item.authorTitle}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'content',
      header: 'Quote',
      cell: ({ row }) => (
        <div className="max-w-[300px] text-sm text-muted-foreground truncate">
          {row.getValue('content')}
        </div>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => {
        const rating = row.getValue('rating') as number | null;
        if (!rating) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
              />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => {
        const featured = row.getValue('featured') as boolean;
        return featured ? (
          <Badge variant="default" className="bg-amber-500">Featured</Badge>
        ) : null;
      },
    },
    {
      accessorKey: 'published',
      header: 'Status',
      cell: ({ row }) => {
        const published = row.getValue('published') as boolean;
        return (
          <Badge variant={published ? 'default' : 'secondary'}>
            {published ? 'Published' : 'Draft'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original;
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
                  href={`/dashboard/testimonials/${item.id}/edit`}
                  className="flex items-center cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(item)}
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
        <MessageSquareQuote className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No testimonials found</h3>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">
        Add testimonials to showcase on your homepage.
      </p>
      <div className="mt-6">
        <Link href="/dashboard/testimonials/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <SimpleDataTable
      columns={columns}
      data={data}
      searchKey="authorName"
      searchPlaceholder="Search testimonials..."
      emptyState={emptyState}
    />
  );
}
