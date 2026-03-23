'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';

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

  // Hide navbar on dashboard routes
  if (pathname?.startsWith('/dashboard')) return null;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => window.location.assign('/') },
    });
  };

  const isHomepage = pathname === '/';

  const navItems: NavItem[] = [
    { name: 'Blog', href: '/blog' },
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
            ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm'
            : isHomepage
              ? 'bg-transparent'
              : 'bg-background/80 backdrop-blur-md border-b border-border/50'
        )}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className={cn('flex items-center justify-between transition-all duration-300', scrolled ? 'h-14' : 'h-16')}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <Image
                src="/logo.png"
                alt="CMS"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className={cn('font-serif font-normal text-lg tracking-tight transition-colors', isHomepage && !scrolled ? 'text-white' : 'text-foreground')}>Nikola</span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="gap-1">
                {navItems.map(item => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'rounded-lg font-medium px-3 py-2 text-sm',
                          pathname === item.href
                            ? 'text-primary font-semibold bg-primary/10'
                            : isHomepage && !scrolled
                              ? 'text-white/80 hover:text-white hover:bg-white/10'
                              : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                        )}
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                {isSignedIn && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/dashboard"
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'rounded-lg font-medium px-3 py-2 text-sm',
                          isHomepage && !scrolled
                            ? 'text-white/80 hover:text-white hover:bg-white/10'
                            : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                        )}
                      >
                        Dashboard
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right - Auth + Mobile Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {!isLoaded ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="w-8 h-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                        <AvatarImage src={user?.image || undefined} alt={userName} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{userInitial}</AvatarFallback>
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
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm" className={cn('rounded-lg font-medium text-sm px-3', isHomepage && !scrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-foreground/80 hover:text-foreground')}>Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm" className={cn('rounded-lg font-medium text-sm px-4', isHomepage && !scrolled ? 'bg-white text-[#0a0a0a] hover:bg-white/90' : 'bg-primary text-primary-foreground hover:bg-primary/90')}>Sign Up</Button>
                  </Link>
                </div>
              )}

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="lg:hidden h-9 w-9 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full bg-background shadow-xl lg:hidden w-full max-w-sm',
          'transform transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="CMS" width={28} height={28} className="rounded-md" />
              <span className="font-serif font-normal text-lg tracking-tight text-foreground">Nikola</span>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setIsMobileMenuOpen(false)} className="h-9 w-9 rounded-lg">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block rounded-xl px-3 py-3 text-sm font-medium transition-all flex items-center justify-between',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-foreground hover:bg-accent'
                  )}
                >
                  <span>{item.name}</span>
                  {pathname === item.href && <ChevronRight className="h-4 w-4 text-primary" />}
                </Link>
              ))}
              {isSignedIn && (
                <>
                  <div className="my-4 border-t" />
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </nav>

          {!isSignedIn && isLoaded && (
            <div className="p-4 border-t space-y-3">
              <Link href="/sign-in" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-11">Sign In</Button>
              </Link>
              <Link href="/sign-up" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full h-11">Sign Up</Button>
              </Link>
            </div>
          )}

          {isSignedIn && (
            <div className="p-4 border-t">
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.image || undefined} alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{userInitial}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{userName}</div>
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
