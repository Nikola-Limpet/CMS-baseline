"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ShadcnBreadcrumbProps {
  homeLabel?: string;
  className?: string;
}

export default function ShadcnBreadcrumb({ homeLabel = "Home", className = "" }: ShadcnBreadcrumbProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  // Skip rendering breadcrumbs on homepage
  if (pathname === '/') return null;
  
  // Parse the pathname to create breadcrumb items
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  // Create a mapping for prettier segment names
  const segmentLabels: Record<string, string> = {
    'news-events': 'News & Events',
    'news': 'News',
    'events': 'Events',
    'blogs': 'Blogs',
    'auth': 'Authentication',
    'login': 'Login',
    'signup': 'Sign Up',
    'dashboard': 'Dashboard',
    'resources': 'Resources',
    'about': 'About',
  };
  
  // Build the breadcrumb items
  const breadcrumbItems = [
    { label: homeLabel, href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, href };
    }),
  ];

  return (
    <Breadcrumb className={`py-5 px-4 animate-fade-in ${className}`}>
      <BreadcrumbList className="text-base text-white font-medium">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-lg">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    {index === 0 ? (
                      <Link href={item.href} className="flex items-center hover:scale-110 transition-transform">
                        <Home className="h-4 w-6 mr-1" />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    ) : (
                      <Link href={item.href} className="hover:scale-105 transition-transform">
                        {item.label}
                      </Link>
                    )}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="mx-2" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}