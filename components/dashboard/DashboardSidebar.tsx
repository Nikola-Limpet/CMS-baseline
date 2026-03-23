"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthUser } from '@/hooks/use-auth-user';
import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Newspaper,
  Users as UsersIcon,
  LogOut,
  User,
  Home,
  Search,
  BarChart3,
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Admin navigation items
const adminNavItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    group: 'main',
    description: 'Overview & Analytics'
  },
  {
    href: '/dashboard/blogs',
    label: 'Blog Posts',
    icon: Newspaper,
    group: 'content',
    description: 'Content Management'
  },
  {
    href: '/dashboard/users',
    label: 'Users',
    icon: UsersIcon,
    group: 'management',
    description: 'User Management'
  },
];

// Regular user navigation items
const userNavItems = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
    group: 'main',
    description: 'Your Dashboard'
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User,
    group: 'account',
    description: 'Profile Settings'
  },
];

// Guest/Unauthenticated navigation items
const guestNavItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
    group: 'main',
    description: 'Return to Homepage'
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: Newspaper,
    group: 'public',
    description: 'Read Blog Posts'
  },
];

// Group navigation items
const groupNavItems = (items: typeof adminNavItems) => {
  const groups: Record<string, typeof adminNavItems> = {};
  items.forEach(item => {
    if (!groups[item.group]) {
      groups[item.group] = [];
    }
    groups[item.group].push(item);
  });
  return groups;
};

// Group labels with icons
const groupLabels: Record<string, { label: string; icon: React.ElementType }> = {
  main: { label: '', icon: Home },
  content: { label: 'Content', icon: Newspaper },
  management: { label: 'Management', icon: UsersIcon },
  account: { label: 'Account', icon: User },
  public: { label: 'Explore', icon: Newspaper },
};

interface DashboardSidebarProps {
  className?: string;
  collapsed?: boolean;
}

export default function DashboardSidebar({ className, collapsed = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useAuthUser();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isCollapsed = collapsed;

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: { onSuccess: () => window.location.assign('/') },
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only redirect from dashboard-specific pages if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn && pathname.startsWith('/dashboard') && pathname !== '/dashboard') {
      router.push('/sign-in?redirect_url=' + encodeURIComponent(pathname));
    }
  }, [isLoaded, isSignedIn, router, pathname]);

  // Determine which nav items to show based on user role
  const navItems = user?.isAdmin ? adminNavItems : (user ? userNavItems : guestNavItems);
  const filteredNavItems = searchQuery
    ? navItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : navItems;
  const groupedItems = groupNavItems(filteredNavItems);

  const isCurrentPath = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (!mounted) {
    return (
      <div className={cn(
        "h-full border-r border-gray-100 bg-[#f7f8fa]",
        isCollapsed ? "w-16" : "w-64",
        className
      )}>
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-12 bg-gray-200/60 rounded-xl"></div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200/60 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-full flex flex-col bg-[#f7f8fa] border-r border-gray-100 transition-all duration-300 ease-in-out font-sans",
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center gap-3 p-5 border-b border-gray-100/50",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <Link href="/" className="flex items-center justify-center w-9 h-9 flex-shrink-0 rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-transform hover:scale-105" title="Go to Home">
          C
        </Link>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <Link href="/" className="block hover:opacity-80 transition-opacity">
              <h1 className="text-base font-bold text-gray-900 truncate leading-none mb-1">
                CMS
              </h1>
            </Link>
            <p className="text-[11px] text-gray-400 font-medium">
              {user?.isAdmin ? 'Administration' : 'Dashboard'}
            </p>
          </div>
        )}
      </div>

      {/* Search Input */}
      {!isCollapsed && (
        <div className="px-4 pt-4 pb-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200/80 bg-gray-50/80 py-2.5 pl-9 pr-3 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Object.entries(groupedItems).map(([groupKey, items]) => (
          <div key={groupKey}>
            {/* Group Label */}
            {!isCollapsed && groupLabels[groupKey]?.label && (
              <div className="px-3 mb-1.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  {groupLabels[groupKey].label}
                </span>
              </div>
            )}

            {/* Navigation Items */}
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = isCurrentPath(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all duration-200",
                      isActive ? (
                        "bg-gray-100/80 text-gray-900 font-semibold"
                      ) : (
                        "text-gray-500 hover:bg-gray-50/80 hover:text-gray-700"
                      ),
                      isCollapsed && "justify-center px-0 py-3"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={cn(
                      "flex-shrink-0 w-5 h-5 transition-colors",
                      isActive ? "text-gray-800" : "text-gray-400 group-hover:text-gray-600"
                    )} />

                    {!isCollapsed && (
                      <span className="truncate leading-none">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Section (Footer) */}
      <div className="p-4 border-t border-gray-100/50 bg-transparent">
        {user ? (
          <div className={cn(
            "flex flex-col gap-3",
            isCollapsed && "items-center"
          )}>
            {!isCollapsed ? (
              <div className="flex items-center gap-3 px-1">
                <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                  <AvatarImage src={user.imageUrl || undefined} alt={user.firstName || 'User'} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : (
              <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                <AvatarImage src={user.imageUrl || undefined} alt={user.firstName || 'User'} />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {user.firstName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}

            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              className={cn(
                "w-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors",
                !isCollapsed && "justify-start pl-2"
              )}
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2 font-medium">Sign out</span>}
            </Button>
          </div>
        ) : (
          <div className="grid gap-2">
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href="/sign-in">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export { DashboardSidebar };
