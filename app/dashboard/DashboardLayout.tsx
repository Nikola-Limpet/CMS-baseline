'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardBreadcrumbs } from '@/components/navigation/Breadcrumbs';
import {
  Menu,
  User,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Auth is handled by proxy.ts and page-level auth() + redirect()
  // Layout always renders the shell to avoid SSR hydration mismatches

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar - fixed width */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 z-30">
        <DashboardSidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <DashboardSidebar className="w-full" />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-gray-700" />
              <span className="font-bold text-gray-900">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/dashboard/profile">
                <User className="h-5 w-5 text-gray-500" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Main scrollable content view */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative focus:outline-none scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-full">
            <DashboardBreadcrumbs className="mb-4" showBackButton={false} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

