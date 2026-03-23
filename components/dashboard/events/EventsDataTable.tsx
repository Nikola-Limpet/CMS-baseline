'use client';

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
  CalendarDays,
  Plus,
  MapPin,
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
import { eventsApi } from '@/lib/api/events';

export type EventRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  eventDate: Date;
  eventEndDate: Date | null;
  location: string | null;
  registrationUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

interface EventsDataTableProps {
  data: EventRow[];
  isLoading?: boolean;
}

export function EventsDataTable({ data, isLoading = false }: EventsDataTableProps) {
  const router = useRouter();

  const handleDelete = async (event: EventRow) => {
    try {
      await eventsApi.posts.delete(event.id);
      toast.success(`Event "${event.title}" deleted successfully`);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  const columns: ColumnDef<EventRow>[] = [
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
        const event = row.original;
        return (
          <div className="max-w-[250px]">
            <div className="font-medium truncate" title={event.title}>
              {event.title}
            </div>
            {event.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{event.location}</span>
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
          <Badge variant={published ? 'default' : 'secondary'}>
            {published ? 'Published' : 'Draft'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'eventDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          Event Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('eventDate') as Date;
        const isUpcoming = new Date(date) >= new Date();
        return (
          <div className="text-sm">
            <span className={isUpcoming ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              {format(new Date(date), 'MMM d, yyyy')}
            </span>
            {isUpcoming && (
              <Badge variant="outline" className="ml-2 text-xs">
                Upcoming
              </Badge>
            )}
          </div>
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
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const event = row.original;
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
                  href={`/events/${event.slug}`}
                  className="flex items-center cursor-pointer"
                  target="_blank"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Event
                  <ExternalLink className="ml-auto h-3 w-3" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/events/${event.id}/edit`}
                  className="flex items-center cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(event)}
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
        <CalendarDays className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No events found</h3>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">
        Get started by creating your first event.
      </p>
      <div className="mt-6">
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
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
      searchPlaceholder="Search events..."
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
}
