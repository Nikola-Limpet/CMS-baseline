'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Home,
  ArrowLeft,
  Newspaper,
  CalendarDays,
  Trophy,
  GraduationCap,
  Puzzle,
  Users,
  Plane,
  Megaphone,
  Award,
  Share2,
  User,
  Plus,
  PenLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  className?: string;
  items?: BreadcrumbItem[];
  showHome?: boolean;
  showBackButton?: boolean;
  maxItems?: number;
}

// Enhanced path mappings with structured hierarchy
const pathMappings: Record<string, { label: string; icon?: React.ElementType }> = {
  // Main sections
  dashboard: { label: 'Dashboard' },
  blogs: { label: 'Blog Management' },
  events: { label: 'Event Management' },
  users: { label: 'User Management' },
  'practice-problems': { label: 'Practice Problems' },
  competitions: { label: 'Competitions' },
  courses: { label: 'Training Courses' },
  learning: { label: 'Learning Resources' },
  blog: { label: 'Blog' },
  about: { label: 'About' },
  
  // Competition specific
  cimoc: { label: 'CIMOC' },
  phimo: { label: 'PHIMO' },
  regional: { label: 'Regional Olympiads' },
  results: { label: 'Results' },
  calendar: { label: 'Calendar' },
  
  // Course specific
  elementary: { label: 'Elementary Math' },
  'middle-school': { label: 'Middle School Math' },
  'high-school': { label: 'High School Math' },
  'competition-prep': { label: 'Competition Prep' },
  schedule: { label: 'Schedule' },
  faculty: { label: 'Faculty' },
  
  // Actions
  new: { label: 'Create New' },
  edit: { label: 'Edit' },
  create: { label: 'Create' },
  
  // Temporal
  year2024: { label: '2024' },
  year2025: { label: '2025' },
  
  // Grades
  grade10: { label: 'Grade 10' },
  grade11: { label: 'Grade 11' },
  grade12: { label: 'Grade 12' },
  
  // Practice problems
  sets: { label: 'Problem Sets' },
  problems: { label: 'Problems' },
  
  // User management
  profile: { label: 'Profile' },
  settings: { label: 'Settings' },

  // Additional dashboard sections
  'study-tour': { label: 'Study Tours' },
  announcements: { label: 'Announcements' },
  achievements: { label: 'Achievements' },
  'social-media': { label: 'Social Media' },
  
  // Registration
  registrations: { label: 'Registrations' },
  
  // Auth
  'sign-in': { label: 'Sign In' },
  'sign-up': { label: 'Sign Up' },
};

// SEO-friendly route structure mapping
const routeStructure: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/dashboard/blogs': ['Dashboard', 'Blog Management'],
  '/dashboard/events': ['Dashboard', 'Event Management'],
  '/dashboard/users': ['Dashboard', 'User Management'],
  '/dashboard/competitions': ['Dashboard', 'Competitions'],
  '/dashboard/courses': ['Dashboard', 'Training Courses'],
  '/dashboard/study-tour': ['Dashboard', 'Study Tours'],
  '/dashboard/announcements': ['Dashboard', 'Announcements'],
  '/dashboard/achievements': ['Dashboard', 'Achievements'],
  '/dashboard/social-media': ['Dashboard', 'Social Media'],
  '/dashboard/profile': ['Dashboard', 'Profile'],
  '/competitions': ['Competitions'],
  '/competitions/cimoc': ['Competitions', 'CIMOC'],
  '/competitions/phimo': ['Competitions', 'PHIMO'],
  '/courses': ['Training Courses'],
  '/practice-problems': ['Practice Problems'],
  '/blog': ['Blog'],
  '/about': ['About'],
};

function generateBreadcrumbs(pathname: string, maxItems?: number): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Check if we have a predefined route structure
  if (routeStructure[pathname]) {
    const labels = routeStructure[pathname];
    let currentPath = '';
    
    labels.forEach((label, index) => {
      if (index === 0) {
        currentPath = label === 'Dashboard' ? '/dashboard' : `/${label.toLowerCase().replace(/\s+/g, '-')}`;
      } else {
        currentPath += `/${label.toLowerCase().replace(/\s+/g, '-')}`;
      }
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: index === labels.length - 1,
      });
    });
  } else {
    // Generate breadcrumbs from URL segments
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip dynamic segments that look like IDs
      if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) || 
          segment.match(/^\d+$/)) {
        return;
      }

      const mapping = pathMappings[segment];
      const label = mapping?.label || segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      breadcrumbs.push({
        label,
        href: currentPath,
        icon: mapping?.icon,
        isActive: index === segments.length - 1,
      });
    });
  }

  // Truncate if maxItems is specified
  if (maxItems && breadcrumbs.length > maxItems) {
    const keep = Math.floor(maxItems / 2);
    const start = breadcrumbs.slice(0, keep);
    const end = breadcrumbs.slice(-keep);
    
    return [
      ...start,
      { label: '...', href: '#', isActive: false },
      ...end,
    ];
  }

  return breadcrumbs;
}

export function Breadcrumbs({ 
  className, 
  items, 
  showHome = true, 
  showBackButton = false,
  maxItems 
}: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Use provided items or generate from pathname
  const breadcrumbItems = items || generateBreadcrumbs(pathname, maxItems);
  
  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null;
  }

  // Get parent path for back button
  const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Back Button */}
      {showBackButton && pathname !== '/' && (
        <Link href={parentPath}>
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 px-2 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
      )}

      {/* Breadcrumb Navigation */}
      <nav 
        className="flex items-center space-x-1 text-sm"
        aria-label="Breadcrumb"
      >
        {/* Home Link */}
        {showHome && (
          <>
            <Link
              href="/"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
            {breadcrumbItems.length > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            )}
          </>
        )}
        
        {/* Breadcrumb Items */}
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;
          
          return (
            <React.Fragment key={`${item.href}-${index}`}>
              {item.label === '...' ? (
                <span className="text-muted-foreground px-1">
                  {item.label}
                </span>
              ) : isLast || item.isActive ? (
                <span 
                  className="flex items-center font-medium text-foreground px-1"
                  aria-current="page"
                >
                  {Icon && <Icon className="h-4 w-4 mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors px-1 py-0.5 rounded hover:bg-accent/50"
                >
                  {Icon && <Icon className="h-4 w-4 mr-1" />}
                  {item.label}
                </Link>
              )}
              
              {!isLast && item.label !== '...' && (
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}

// Icon map matching DashboardSidebar icons for visual consistency
const dashboardSectionIcons: Record<string, React.ElementType> = {
  blogs: Newspaper,
  events: CalendarDays,
  competitions: Trophy,
  courses: GraduationCap,
  'practice-problems': Puzzle,
  users: Users,
  'study-tour': Plane,
  announcements: Megaphone,
  achievements: Award,
  'social-media': Share2,
  profile: User,
};

// Specialized breadcrumb for dashboard pages
export function DashboardBreadcrumbs({
  className,
  showBackButton = true,
  maxItems = 5
}: {
  className?: string;
  showBackButton?: boolean;
  maxItems?: number;
}) {
  const pathname = usePathname();

  // Don't show breadcrumbs on dashboard root
  if (pathname === '/dashboard') return null;

  // Enhanced custom breadcrumb items for dashboard sections
  const customItems: BreadcrumbItem[] = [];

  // Helper: push the common "Dashboard" root crumb
  const pushDashboard = () => {
    customItems.push({ label: 'Dashboard', href: '/dashboard', icon: Home });
  };

  // Helper: push a section crumb with its sidebar icon
  const pushSection = (key: string, label: string, href: string, isActive = false) => {
    customItems.push({ label, href, icon: dashboardSectionIcons[key], isActive });
  };

  // Helper: push an action crumb (create / edit)
  const pushCreate = (label: string) => {
    customItems.push({ label, href: pathname, icon: Plus, isActive: true });
  };
  const pushEdit = (label: string) => {
    customItems.push({ label, href: pathname, icon: PenLine, isActive: true });
  };

  if (pathname.startsWith('/dashboard/blogs')) {
    pushDashboard();
    pushSection('blogs', 'Blog Management', '/dashboard/blogs');

    if (pathname.includes('/new')) {
      pushCreate('Create New Post');
    } else if (pathname.includes('/edit')) {
      pushEdit('Edit Post');
    }
  } else if (pathname.startsWith('/dashboard/events')) {
    pushDashboard();
    pushSection('events', 'Event Management', '/dashboard/events');

    if (pathname.includes('/new')) {
      pushCreate('Create New Event');
    } else if (pathname.includes('/edit')) {
      pushEdit('Edit Event');
    }
  } else if (pathname.startsWith('/dashboard/competitions')) {
    pushDashboard();
    pushSection('competitions', 'Competitions', '/dashboard/competitions');

    if (pathname.includes('/new')) {
      pushCreate('Create New Competition');
    } else if (pathname.includes('/edit')) {
      pushEdit('Edit Competition');
    } else if (pathname.includes('/problems')) {
      const compId = pathname.split('/')[3];
      customItems.push({ label: `Competition ${compId}`, href: `/dashboard/competitions/${compId}` });
      customItems.push({ label: 'Problems', href: pathname, icon: Puzzle, isActive: true });
    } else if (pathname.includes('/registrations')) {
      customItems.push({ label: 'Registrations', href: pathname, isActive: true });
    }
  } else if (pathname.startsWith('/dashboard/courses')) {
    pushDashboard();
    pushSection('courses', 'Course Management', '/dashboard/courses');

    if (pathname.includes('/new')) {
      pushCreate('Create New Course');
    } else if (pathname.includes('/edit')) {
      pushEdit('Edit Course');
    }
  } else if (pathname.startsWith('/dashboard/practice-problems')) {
    pushDashboard();
    pushSection('practice-problems', 'Practice Problems', '/dashboard/practice-problems');

    if (pathname.includes('/sets/') && pathname.includes('/problems')) {
      const setId = pathname.split('/')[4];
      customItems.push({ label: `Problem Set ${setId}`, href: `/dashboard/practice-problems/sets/${setId}` });

      if (pathname.includes('/new')) {
        pushCreate('Add Problem');
      } else {
        customItems.push({ label: 'Problems', href: pathname, icon: Puzzle, isActive: true });
      }
    } else if (pathname.includes('/sets/new')) {
      pushCreate('Create Problem Set');
    } else if (pathname.includes('/edit')) {
      pushEdit('Edit Problem');
    } else if (pathname.includes('/new')) {
      pushCreate('Create Problem');
    }
  } else if (pathname.startsWith('/dashboard/users')) {
    pushDashboard();
    pushSection('users', 'User Management', '/dashboard/users');

    if (pathname.split('/').length > 3) {
      customItems.push({ label: 'User Details', href: pathname, icon: User, isActive: true });
    }
  } else if (pathname.startsWith('/dashboard/study-tour')) {
    pushDashboard();
    pushSection('study-tour', 'Study Tours', '/dashboard/study-tour');

    if (pathname.includes('/new') || pathname.includes('/create')) {
      pushCreate('Create New');
    } else if (pathname.includes('/edit')) {
      pushEdit('Edit');
    }
  } else if (pathname.startsWith('/dashboard/announcements')) {
    pushDashboard();
    pushSection('announcements', 'Announcements', '/dashboard/announcements');

    if (pathname.includes('/new') || pathname.includes('/create')) {
      pushCreate('Create New');
    } else if (pathname.includes('/edit')) {
      pushEdit('Edit');
    }
  } else if (pathname.startsWith('/dashboard/achievements')) {
    pushDashboard();
    pushSection('achievements', 'Achievements', '/dashboard/achievements');

    if (pathname.includes('/new') || pathname.includes('/create')) {
      pushCreate('Create New');
    } else if (pathname.includes('/edit')) {
      pushEdit('Edit');
    }
  } else if (pathname.startsWith('/dashboard/social-media')) {
    pushDashboard();
    pushSection('social-media', 'Social Media', '/dashboard/social-media');

    if (pathname.includes('/new') || pathname.includes('/create')) {
      pushCreate('Create New');
    } else if (pathname.includes('/edit')) {
      pushEdit('Edit');
    }
  } else if (pathname.startsWith('/dashboard/profile')) {
    pushDashboard();
    pushSection('profile', 'Profile', pathname, true);
  } else if (pathname.startsWith('/dashboard/')) {
    // Generic fallback for any unhandled dashboard route
    pushDashboard();

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 1) {
      const section = segments[1];
      const sectionLabel = pathMappings[section]?.label ||
        section.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      customItems.push({
        label: sectionLabel,
        href: `/dashboard/${section}`,
        icon: dashboardSectionIcons[section],
        isActive: segments.length === 2,
      });

      if (segments.length > 2) {
        const lastSegment = segments[segments.length - 1];
        if (lastSegment === 'new' || lastSegment === 'create') {
          pushCreate('Create New');
        } else if (lastSegment === 'edit') {
          pushEdit('Edit');
        }
      }
    }
  }
  
  return (
    <Breadcrumbs 
      className={className}
      items={customItems}
      showHome={false}
      showBackButton={showBackButton}
      maxItems={maxItems}
    />
  );
}

// Public breadcrumbs for non-dashboard pages
export function PublicBreadcrumbs({ 
  className,
  showBackButton = false,
  maxItems = 4 
}: { 
  className?: string;
  showBackButton?: boolean;
  maxItems?: number;
}) {
  return (
    <Breadcrumbs 
      className={className}
      showHome={true}
      showBackButton={showBackButton}
      maxItems={maxItems}
    />
  );
}

// Structured data for SEO
export function BreadcrumbStructuredData() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  
  if (breadcrumbs.length === 0) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `${process.env.NEXT_PUBLIC_APP_URL}${item.href}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}