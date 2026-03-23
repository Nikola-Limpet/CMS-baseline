'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import {
  ArrowLeft,
  Save,
  Loader2,
  User as UserIcon,
  Mail,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { User } from '@/db/schema';

interface EditUserFormProps {
  user: User | null;
  isNewUser: boolean;
}

export function EditUserForm({ user, isNewUser }: EditUserFormProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email ?? '',
    name: user?.name ?? '',
    role: user?.role ?? 'user',
    bio: user?.bio ?? '',
    banned: user?.banned ?? false,
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isNewUser) {
        toast.info('Creating new users directly is not supported. Users are created when they sign up.');
        router.push('/dashboard/users');
        return;
      }

      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      toast.success(`User ${isNewUser ? 'created' : 'updated'} successfully`);
      router.push('/dashboard/users');
    } catch {
      toast.error(`Failed to ${isNewUser ? 'create' : 'update'} user. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/users')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              {!isNewUser && (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.image || ''} alt={user?.email || ''} />
                  <AvatarFallback>
                    {user?.name
                      ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                      : user?.email?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <CardTitle>
                  {isNewUser ? 'Create New User' : `Edit User: ${user?.name || user?.email}`}
                </CardTitle>
                <CardDescription>
                  {isNewUser
                    ? 'Add a new user to the system'
                    : `User ID: ${user?.id} • Last updated: ${new Date(user?.updatedAt || '').toLocaleString()}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="details">User Details</TabsTrigger>
                <TabsTrigger value="account" disabled={isNewUser}>Account Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="user@example.com"
                        className="pl-8"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">User Role</Label>
                    <Select
                      value={formData.role || 'user'}
                      onValueChange={(value) => handleSelectChange('role', value)}
                      disabled={currentUser?.id === user?.id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Full name"
                        className="pl-8"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="User bio or description"
                    rows={4}
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="banned"
                    checked={!formData.banned}
                    onCheckedChange={(checked) => handleSwitchChange('banned', !checked)}
                  />
                  <Label htmlFor="banned" className="cursor-pointer">
                    {!formData.banned ? (
                      <span className="flex items-center">
                        <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                        Active Account
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserX className="mr-2 h-4 w-4 text-gray-500" />
                        Banned Account
                      </span>
                    )}
                  </Label>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-4">
                {!isNewUser && user && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Account Created</Label>
                        <p>{new Date(user.createdAt).toLocaleString()}</p>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Last Updated</Label>
                        <p>{new Date(user.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Account Status</h3>
                      <p className="text-sm text-muted-foreground">
                        Email verified: {user.emailVerified ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/users')}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
