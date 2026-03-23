'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from 'lucide-react';
import { UserHeader } from '@/components/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import type { User } from '@/db/schema';

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

interface UsersDashboardClientProps {
  initialUsers: User[];
  pagination: Pagination;
  currentPage: number;
  currentRole: string;
}

export function UsersDashboardClient({ initialUsers, pagination, currentPage: _currentPage, currentRole }: UsersDashboardClientProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });

        startTransition(() => {
          router.refresh();
        });
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to delete user. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    if (currentRole && currentRole !== 'all') {
      params.set('role', currentRole);
    }
    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handleRoleFilterChange = (value: string) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    if (value && value !== 'all') {
      params.set('role', value);
    }
    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const filteredUsers = searchTerm
    ? initialUsers.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : initialUsers;

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-neutral-50 via-white to-bg-blue-light/30">
      <UserHeader
        onRefresh={handleRefresh}
        isRefreshing={isPending}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">All Users</CardTitle>
              <CardDescription>
                Total {pagination.total} users
              </CardDescription>
            </div>
            <Button onClick={() => router.push('/dashboard/users/new')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex w-full sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Select value={currentRole || 'all'} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users table */}
          {filteredUsers.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.image || ''} alt={user.email} />
                            <AvatarFallback>
                              {user.name
                                ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                                : user.email.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.name || user.email.split('@')[0]}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                        >
                          {(user.role || 'user').charAt(0).toUpperCase() + (user.role || 'user').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.banned ? (
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-neutral-300 mr-2"></div>
                            <span>Banned</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-primary-green mr-2"></div>
                            <span>Active</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user.id)}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                            disabled={user.id === currentUser?.id}
                          >
                            <Trash2 className="h-4 w-4 text-error" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              <UserCog className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2">No users found</p>
              {searchTerm && (
                <Button
                  variant="ghost"
                  onClick={() => setSearchTerm('')}
                  className="mt-2"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <CardFooter className="flex justify-between items-center border-t p-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} users
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.page - 1 && page <= pagination.page + 1)
                )
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    );
                  }

                  return (
                    <Button
                      key={page}
                      variant={pagination.page === page ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
