'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
}

export function Navbar(): React.ReactElement | null {
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = !!session?.user;
  const isLoaded = !isPending;
  const user = session?.user;

  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/dashboard')) return null;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => window.location.assign('/') },
    });
  };

  const navItems: NavItem[] = [
    { name: 'About', href: '/#about' },
    { name: 'Programs', href: '/#programs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Events', href: '/events' },
  ];

  const userInitial = user?.name?.[0]?.toUpperCase() || 'U';
  const userName = user?.name || '';
  const userEmail = user?.email || '';

  return (
    <div>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className={cn('flex items-center justify-between transition-all duration-300', scrolled ? 'h-16' : 'h-20')}>
            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <span className="text-xl tracking-tight text-navy font-serif">
                Nikola
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    pathname === item.href
                      ? 'text-navy'
                      : 'text-navy/70 hover:text-navy'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {isSignedIn && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/#contact"
                className="text-sm font-medium text-navy border-b border-navy pb-0.5 hover:opacity-80 transition-opacity"
              >
                Contact Us
              </Link>
            </nav>

            {/* Right - Auth + Mobile Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              {!isLoaded ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="w-8 h-8 ring-2 ring-navy/20 hover:ring-navy/40 transition-all cursor-pointer">
                        <AvatarImage src={user?.image || undefined} alt={userName} />
                        <AvatarFallback className="bg-navy/10 text-navy text-xs font-semibold">{userInitial}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm" className="text-sm font-medium text-navy/70 hover:text-navy hover:bg-navy/5">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="lg:hidden h-9 w-9 text-navy"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      {/* Mobile Menu Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full bg-white shadow-xl lg:hidden w-full max-w-sm',
          'transform transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <span className="text-xl tracking-tight text-navy">
              <span className="font-serif font-normal">Edmun</span>
              <span className="font-serif italic">High</span>
            </span>
            <Button size="icon" variant="ghost" onClick={() => setIsMobileMenuOpen(false)} className="h-9 w-9 text-navy">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-5">
            <div className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-3 py-3 text-sm font-medium transition-colors rounded-lg',
                    pathname === item.href
                      ? 'bg-navy/5 text-navy'
                      : 'text-navy/70 hover:text-navy hover:bg-navy/5'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-sm font-medium text-navy/70 hover:text-navy hover:bg-navy/5 rounded-lg"
              >
                Contact Us
              </Link>
              {isSignedIn && (
                <>
                  <div className="my-4 border-t border-gray-100" />
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 text-sm font-medium text-navy/70 hover:text-navy hover:bg-navy/5 rounded-lg"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </nav>

          {!isSignedIn && isLoaded && (
            <div className="p-5 border-t border-gray-100 space-y-3">
              <Link href="/sign-in" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-11 border-navy/20 text-navy">Sign In</Button>
              </Link>
              <Link href="/sign-up" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full h-11 bg-navy text-white hover:bg-navy-light">Sign Up</Button>
              </Link>
            </div>
          )}

          {isSignedIn && (
            <div className="p-5 border-t border-gray-100">
              <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.image || undefined} alt={userName} />
                  <AvatarFallback className="bg-navy/10 text-navy text-xs font-semibold">{userInitial}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-navy truncate">{userName}</div>
                  <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
                </div>
                <button onClick={handleSignOut} className="text-muted-foreground hover:text-red-600 transition-colors p-1">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
