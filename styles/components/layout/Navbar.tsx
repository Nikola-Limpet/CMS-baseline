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
import { GlobalSearch } from '@/components/navigation/GlobalSearch';
import { useLanguage } from '@/components/language-provider';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ElementType;
}

// Flag components — proper proportions with rounded border
const FlagWrapper = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex w-5 h-3.5 rounded-sm overflow-hidden border border-black/10 shrink-0">
    {children}
  </span>
);

const USFlag = () => (
  <FlagWrapper>
    <svg viewBox="0 0 60 30" className="w-full h-full">
      <clipPath id="us"><rect width="60" height="30" /></clipPath>
      <g clipPath="url(#us)">
        {/* Stripes */}
        <rect width="60" height="30" fill="#B22234" />
        <rect y="2.31" width="60" height="2.31" fill="#fff" />
        <rect y="6.92" width="60" height="2.31" fill="#fff" />
        <rect y="11.54" width="60" height="2.31" fill="#fff" />
        <rect y="16.15" width="60" height="2.31" fill="#fff" />
        <rect y="20.77" width="60" height="2.31" fill="#fff" />
        <rect y="25.38" width="60" height="2.31" fill="#fff" />
        {/* Canton */}
        <rect width="24" height="16.15" fill="#3C3B6E" />
      </g>
    </svg>
  </FlagWrapper>
);

const KhmerFlag = () => (
  <FlagWrapper>
    <svg viewBox="0 0 75 48" className="w-full h-full">
      <rect width="75" height="12" fill="#032EA1" />
      <rect y="12" width="75" height="24" fill="#E00025" />
      <rect y="36" width="75" height="12" fill="#032EA1" />
      {/* Simplified Angkor Wat */}
      <g fill="#fff" transform="translate(37.5,24)">
        <rect x="-3" y="-7" width="6" height="10" />
        <polygon points="-4,-7 0,-10 4,-7" />
        <rect x="-9" y="-5" width="4" height="8" />
        <polygon points="-9,-5 -7,-7 -5,-5" />
        <rect x="5" y="-5" width="4" height="8" />
        <polygon points="5,-5 7,-7 9,-5" />
        <rect x="-12" y="3" width="24" height="2" />
      </g>
    </svg>
  </FlagWrapper>
);

export function Navbar(): React.ReactElement | null {
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = !!session?.user;
  const isLoaded = !isPending;
  const user = session?.user;

  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Enhanced scroll detection with multiple thresholds
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrolled = scrollY > 20;
      const progress = Math.min(scrollY / 100, 1);

      setScrolled(isScrolled);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  // Hide navbar on dashboard routes (after all hooks)
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => window.location.assign('/') },
    });
  };

  const navItems: NavItem[] = [
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];

  // Full names for mobile menu where space isn't as constrained
  const mobileNavItems: NavItem[] = [
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];

  const mobileLinkClasses = cn(
    'block rounded-xl px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-medium transition-all duration-300',
    'min-h-[44px] text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
    'flex items-center touch-manipulation'
  );

  const mobileActiveLinkClasses = cn(
    'bg-primary/10 text-primary font-semibold border-l-4 border-primary rounded-l-none'
  );

  const userInitial = user?.name?.[0]?.toUpperCase() || 'U';
  const userName = user?.name || '';
  const userEmail = user?.email || '';

  return (
    <div>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-border shadow-lg'
            : 'bg-white/80 backdrop-blur-md border-b border-border/50'
        )}
        style={{
          transform: `translateY(${scrollProgress * -2}px)`,
        }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={cn(
              'flex items-center justify-between transition-all duration-300',
              scrolled ? 'h-14' : 'h-14 sm:h-16'
            )}
          >
            {/* Left - Language + Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
                className="h-8 px-1.5 hover:bg-accent rounded-lg flex items-center gap-1"
                aria-label={
                  language === 'en' ? 'Switch to Khmer' : 'Switch to English'
                }
              >
                {language === 'en' ? <KhmerFlag /> : <USFlag />}
                <span
                  className={cn(
                    'text-xs font-medium',
                    language === 'km' ? 'font-kantumruy' : ''
                  )}
                >
                  {language === 'en' ? 'ខ្មែរ' : 'EN'}
                </span>
              </Button>

              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  className={cn(
                    'object-contain transition-all duration-300',
                    scrolled ? 'w-8 h-8' : 'w-9 h-9'
                  )}
                  unoptimized
                />
                <span
                  className={cn(
                    'font-bold text-primary hidden sm:inline',
                    scrolled ? 'text-base' : 'text-lg'
                  )}
                >
                  CMS
                </span>
              </Link>
            </div>

            {/* Center - Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="gap-1">
                {navItems.map(item => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'rounded-lg font-medium px-3 py-2 text-sm transition-colors',
                          pathname === item.href
                            ? 'text-primary font-semibold bg-primary/10'
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
                          'rounded-lg font-medium px-3 py-2 text-sm transition-colors',
                          pathname.startsWith('/dashboard')
                            ? 'text-primary font-semibold bg-primary/10'
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

            {/* Right - Auth + Mobile Menu */}
            <div className="flex items-center gap-2 shrink-0">
              {!isLoaded ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className={cn(
                        'ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer',
                        scrolled ? 'w-7 h-7' : 'w-8 h-8'
                      )}>
                        <AvatarImage src={user?.image || undefined} alt={userName} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {userInitial}
                        </AvatarFallback>
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
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/sign-in">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 rounded-lg font-medium text-sm px-3"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                className={cn(
                  'lg:hidden text-muted-foreground hover:text-foreground rounded-lg touch-manipulation',
                  scrolled ? 'h-8 w-8' : 'h-9 w-9'
                )}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu Panel */}
      <>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel - Responsive sizing */}
        <div
          className={cn(
            'fixed top-0 right-0 z-50 h-full bg-white shadow-xl lg:hidden',
            'w-full max-w-sm sm:max-w-md',
            'transform transition-transform duration-300 ease-in-out',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header - Responsive padding */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="object-contain sm:w-8 sm:h-8"
                  unoptimized
                />
                <span className="font-semibold text-base sm:text-lg text-primary">
                  CMS
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg touch-manipulation"
                aria-label="Close menu"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Navigation - Responsive padding */}
            <nav className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Language Switch - Always visible in mobile menu */}
              <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Language
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
                    className={cn(
                      'h-8 px-3 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300',
                      'flex items-center gap-2',
                      language === 'km' ? 'font-kantumruy' : ''
                    )}
                  >
                    {language === 'en' ? <KhmerFlag /> : <USFlag />}
                    <span>{language === 'en' ? 'ខ្មែរ' : 'English'}</span>
                  </Button>
                </div>
              </div>

              {/* Mobile Search - Only show when signed in */}
              {isSignedIn && (
                <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border">
                  <div className="mobile-search">
                    <GlobalSearch />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {mobileNavItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      mobileLinkClasses,
                      pathname === item.href && mobileActiveLinkClasses
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {pathname === item.href && (
                        <ChevronRight className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </Link>
                ))}

                {isSignedIn && (
                  <>
                    <div className="my-4 border-t border-border" />
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        mobileLinkClasses,
                        pathname.startsWith('/dashboard') &&
                          mobileActiveLinkClasses
                      )}
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </div>
            </nav>

            {/* Footer - Responsive padding */}
            {!isSignedIn && isLoaded && (
              <div className="p-4 sm:p-6 border-t border-border space-y-3">
                <Link href="/sign-in" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-11 sm:h-12 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 touch-manipulation text-sm sm:text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="block">
                  <Button
                    className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-sm hover:shadow touch-manipulation text-sm sm:text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {isSignedIn && (
              <div className="p-4 sm:p-6 border-t border-border">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-accent/50 rounded-lg">
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                    <AvatarImage src={user?.image || undefined} alt={userName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm truncate">
                      {userName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {userEmail}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
}
