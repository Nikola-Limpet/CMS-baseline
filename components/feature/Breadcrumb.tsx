"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BreadcrumbProps {
  homeLabel?: string;
  className?: string;
}

export default function Breadcrumb({ homeLabel = "Home", className = "" }: BreadcrumbProps) {
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
    <nav 
      aria-label="Breadcrumb" 
      className={`py-3 px-4 animate-fade-in ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
              )}
              
              {isLast ? (
                <span className="font-medium text-teal-600">
                  {item.label}
                </span>
              ) : (
                <>
                  {index === 0 ? (
                    <Link 
                      href={item.href} 
                      className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
                    >
                      <Home className="h-4 w-4 mr-1" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  ) : (
                    <Link 
                      href={item.href} 
                      className="text-gray-600 hover:text-teal-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}