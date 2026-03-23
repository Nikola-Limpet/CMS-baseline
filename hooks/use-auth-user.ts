'use client';

import { authClient } from '@/lib/auth-client';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image: string | null | undefined;
  role: string | null | undefined;
  bio: string | null | undefined;
  preferences: string | null | undefined;
  emailVerified: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  firstName: string;
  lastName: string;
  imageUrl: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export function useAuthUser() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const authUser: AuthUser | null = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        bio: user.bio,
        preferences: user.preferences,
        emailVerified: user.emailVerified,
        isAdmin: user.role === 'admin',
        isStudent: user.role !== 'admin',
        isLoaded: true,
        isSignedIn: true,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        imageUrl: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    : null;

  return {
    user: authUser,
    isLoaded: !isPending,
    isSignedIn: !!user,
    error: null,
  };
}
