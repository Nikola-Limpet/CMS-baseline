"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Menu, 
  X, 
  Search, 
  Bell,
  User,
  ChevronRight,
  Home,
  Trophy,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TouchButton } from './touch-optimized';

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backButtonHref?: string;
  onBackClick?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actions?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    isAdmin?: boolean;
  };
  notifications?: {
    count: number;
    items: {
      id: string;
      title: string;
      message: string;
      time: string;
      read: boolean;
    }[];
  };
  className?: string;
}

const navigationItems = [
  { 
    label: 'Home', 
    href: '/', 
    icon: Home,
    description: 'Welcome dashboard'
  },
  { 
    label: 'Competitions', 
    href: '/competitions', 
    icon: Trophy,
    description: 'Math olympiads & contests',
    badge: 'Live'
  },
  { 
    label: 'Practice', 
    href: '/practice', 
    icon: BookOpen,
    description: 'Problem sets & exercises'
  },
  { 
    label: 'Courses', 
    href: '/courses', 
    icon: Calendar,
    description: 'Training programs'
  },
  { 
    label: 'Blog', 
    href: '/blog', 
    icon: FileText,
    description: 'News & insights'
  },
];

const userMenuItems = [
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Dashboard', href: '/dashboard', icon: Settings },
  { label: 'Sign Out', href: '/sign-out', icon: LogOut, variant: 'destructive' as const },
];

export function MobileHeader({
  title,
  showBackButton = false,
  backButtonHref,
  onBackClick,
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  actions,
  user,
  notifications,
  className,
}: MobileHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backButtonHref) {
      router.push(backButtonHref);
    } else {
      router.back();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 lg:hidden',
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm' 
            : 'bg-white/90 backdrop-blur-md border-b border-gray-100',
          className
        )}
      >
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left section */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {showBackButton ? (
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="h-10 w-10 p-0 -ml-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </TouchButton>
            ) : (
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="h-10 w-10 p-0 -ml-2"
              >
                <Menu className="h-5 w-5" />
              </TouchButton>
            )}
            
            {/* Title or Logo */}
            {title ? (
              <h1 className="font-semibold text-lg text-gray-900 truncate">
                {title}
              </h1>
            ) : (
              <Link href="/" className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">C</span>
                <span className="font-bold text-lg text-primary hidden xs:block">
                  CMS
                </span>
              </Link>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            {/* Search button */}
            {showSearch && (
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="h-10 w-10 p-0"
              >
                <Search className="h-5 w-5" />
              </TouchButton>
            )}

            {/* Notifications */}
            {notifications && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 relative"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.count > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                      >
                        {notifications.count > 9 ? '9+' : notifications.count}
                      </Badge>
                    )}
                  </TouchButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.items.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.items.slice(0, 5).map((notification) => (
                        <DropdownMenuItem key={notification.id} className="flex-col items-start p-3">
                          <div className="font-medium text-sm">{notification.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{notification.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-sm text-gray-500">
                      No new notifications
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </TouchButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.isAdmin && (
                        <Badge variant="outline" className="text-xs w-fit">Admin</Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link 
                        href={item.href}
                        className={cn(
                          'flex items-center',
                          item.variant === 'destructive' && 'text-red-600 focus:text-red-600'
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Custom actions */}
            {actions}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          <div className="relative bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="h-10 w-10 p-0 -ml-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </TouchButton>
              <div className="flex-1">
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="h-10 text-base border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 z-50 h-full w-80 max-w-[90vw] bg-white shadow-xl lg:hidden transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">C</span>
                  <div>
                    <div className="font-semibold text-lg text-primary">
                      CMS
                    </div>
                    {user && (
                      <div className="text-sm text-gray-500">
                        Welcome, {user.name.split(' ')[0]}
                      </div>
                    )}
                  </div>
                </div>
                <TouchButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </TouchButton>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg transition-colors',
                        'touch-manipulation select-none',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary border-l-4 border-primary rounded-l-none'
                          : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Admin Dashboard Link */}
                {user?.isAdmin && (
                  <>
                    <div className="my-4 border-t border-gray-200" />
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg transition-colors',
                        'touch-manipulation select-none',
                        pathname.startsWith('/dashboard')
                          ? 'bg-primary/10 text-primary border-l-4 border-primary rounded-l-none'
                          : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Admin Dashboard</div>
                          <div className="text-xs text-gray-500">Manage platform</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">Admin</Badge>
                    </Link>
                  </>
                )}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                {user ? (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <TouchButton fullWidth onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/sign-in" className="w-full">Sign In</Link>
                    </TouchButton>
                    <TouchButton fullWidth variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/sign-up" className="w-full">Sign Up</Link>
                    </TouchButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Header Offset */}
      <div className="h-14 lg:hidden" />
    </>
  );
} 