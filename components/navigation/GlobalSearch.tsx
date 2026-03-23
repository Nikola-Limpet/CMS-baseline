'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  Calendar,
  Users,
  BookOpen,
  Trophy,
  GraduationCap,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuthUser } from '@/hooks/use-auth-user';

// Search result types
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'page' | 'blog' | 'event' | 'user' | 'practice' | 'competition';
  href: string;
  icon: React.ElementType;
  category: string;
  tags?: string[];
  lastModified?: Date;
}

// Predefined searchable content
const staticSearchData: SearchResult[] = [
  // Pages
  {
    id: 'home',
    title: 'Home',
    description: 'CMS homepage with latest news and updates',
    type: 'page',
    href: '/',
    icon: BookOpen,
    category: 'Navigation',
    tags: ['home', 'main', 'landing'],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Administrative dashboard for content management',
    type: 'page',
    href: '/dashboard',
    icon: Users,
    category: 'Admin',
    tags: ['admin', 'management', 'dashboard'],
  },
  {
    id: 'competitions',
    title: 'Olympiad Competitions',
    description: 'Mathematical olympiad competitions and events',
    type: 'competition',
    href: '/competitions',
    icon: Trophy,
    category: 'Competitions',
    tags: ['olympiad', 'math', 'competition', 'contest'],
  },
  {
    id: 'practice-problems',
    title: 'Practice Problems',
    description: 'Mathematical practice problems and exercises',
    type: 'practice',
    href: '/practice-problems',
    icon: GraduationCap,
    category: 'Learning',
    tags: ['practice', 'problems', 'math', 'exercises'],
  },
  {
    id: 'cimoc-2024-grade10',
    title: 'CIMOC 2024 Grade 10',
    description: 'CIMOC 2024 practice problems for Grade 10 students',
    type: 'practice',
    href: '/practice-problems/cimoc/year2024/grade10',
    icon: GraduationCap,
    category: 'Practice Problems',
    tags: ['cimoc', '2024', 'grade10', 'practice'],
  },
  {
    id: 'cimoc-2024-grade11',
    title: 'CIMOC 2024 Grade 11',
    description: 'CIMOC 2024 practice problems for Grade 11 students',
    type: 'practice',
    href: '/practice-problems/cimoc/year2024/grade11',
    icon: GraduationCap,
    category: 'Practice Problems',
    tags: ['cimoc', '2024', 'grade11', 'practice'],
  },
  {
    id: 'cimoc-2025-grade10',
    title: 'CIMOC 2025 Grade 10',
    description: 'CIMOC 2025 practice problems for Grade 10 students',
    type: 'practice',
    href: '/practice-problems/cimoc/year2025/grade10',
    icon: GraduationCap,
    category: 'Practice Problems',
    tags: ['cimoc', '2025', 'grade10', 'practice'],
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Educational articles and news',
    type: 'blog',
    href: '/blog',
    icon: FileText,
    category: 'Content',
    tags: ['blog', 'articles', 'news', 'education'],
  },
  {
    id: 'learning',
    title: 'Olympiad Training',
    description: 'Comprehensive training materials for mathematical olympiads',
    type: 'page',
    href: '/learning',
    icon: BookOpen,
    category: 'Learning',
    tags: ['training', 'olympiad', 'learning', 'materials'],
  },
  {
    id: 'about',
    title: 'About',
    description: 'Learn about CMS and our mission',
    type: 'page',
    href: '/about',
    icon: BookOpen,
    category: 'Information',
    tags: ['about', 'mission', 'info'],
  },
  {
    id: 'courses',
    title: 'Courses',
    description: 'Browse available courses',
    type: 'page',
    category: 'Learning',
    href: '/courses',
    icon: BookOpen,
    tags: ['courses', 'learning', 'education'],
  },
];

// Admin-specific search results
const adminSearchData: SearchResult[] = [
  {
    id: 'blog-management',
    title: 'Blog Management',
    description: 'Manage blog posts and articles',
    type: 'page',
    href: '/dashboard/blogs',
    icon: FileText,
    category: 'Admin',
    tags: ['blog', 'management', 'admin', 'posts'],
  },
  {
    id: 'event-management',
    title: 'Event Management',
    description: 'Manage events and competitions',
    type: 'page',
    href: '/dashboard/events',
    icon: Calendar,
    category: 'Admin',
    tags: ['events', 'management', 'admin', 'competitions'],
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Manage user accounts and permissions',
    type: 'page',
    href: '/dashboard/users',
    icon: Users,
    category: 'Admin',
    tags: ['users', 'management', 'admin', 'accounts'],
  },
];

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();
  const { user } = useAuthUser();
  const isAdmin = user?.isAdmin || false;

  // Combine search data based on user role
  const searchData = useMemo(() => {
    return isAdmin
      ? [...staticSearchData, ...adminSearchData]
      : staticSearchData;
  }, [isAdmin]);

  // Search function
  const searchContent = useCallback(
    (searchQuery: string): SearchResult[] => {
      if (!searchQuery.trim()) return [];

      const query = searchQuery.toLowerCase();

      return searchData
        .filter(item => {
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchDescription = item.description
            ?.toLowerCase()
            .includes(query);
          const matchCategory = item.category.toLowerCase().includes(query);
          const matchTags = item.tags?.some(tag =>
            tag.toLowerCase().includes(query)
          );

          return matchTitle || matchDescription || matchCategory || matchTags;
        })
        .slice(0, 8); // Limit to 8 results
    },
    [searchData]
  );

  // Handle search input
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    setIsLoading(true);

    // Simulate API delay for better UX
    const timeoutId = setTimeout(() => {
      const searchResults = searchContent(query);
      setResults(searchResults);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, searchContent]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      }

      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].href);
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, router]);

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.href);
    setIsOpen(false);
    setQuery('');
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'blog':
        return FileText;
      case 'event':
        return Calendar;
      case 'user':
        return Users;
      case 'practice':
        return GraduationCap;
      case 'competition':
        return Trophy;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'event':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'user':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'practice':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'competition':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="ghost"
        size="sm" 
        className={cn(
          'h-9 w-9 shrink-0 p-0 bg-background hover:bg-muted border border-border/50 hover:border-border transition-colors',
          className
        )}
        onClick={() => setIsOpen(true)}
        aria-label="Open search"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="global-search-dialog">
          <DialogContent className="max-w-2xl mx-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-lg font-semibold">
              Search Everything
            </DialogTitle>
          </DialogHeader>

          <div className="px-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pages, blogs, events, practice problems..."
                className="pl-10 pr-10 h-12 text-base"
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="px-6 pb-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-lg text-muted-foreground">
                  Searching...
                </span>
              </div>
            ) : results.length > 0 ? (
              <div className="mt-4 space-y-2">
                <div className="text-sm text-muted-foreground mb-3">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
                {results.map((result, index) => {
                  const Icon = result.icon;
                  const TypeIcon = getTypeIcon(result.type);

                  return (
                    <button
                      key={result.id}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border transition-all duration-200',
                        'hover:bg-muted/50 hover:border-muted-foreground/20',
                        selectedIndex === index
                          ? ' ring-1 ring-primary/20'
                          : 'border-border'
                      )}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-foreground truncate">
                              {result.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs',
                                getTypeColor(result.type)
                              )}
                            >
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {result.category}
                            </Badge>
                          </div>
                          {result.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {result.description}
                            </p>
                          )}
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.tags.slice(0, 3).map(tag => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : query.trim() ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No results found for "{query}"
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Start typing to search pages, blogs, events, and more
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">↑↓</kbd>
                  <span>to navigate</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">↵</kbd>
                  <span>to select</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">esc</kbd>
                  <span>to close</span>
                </div>
              </div>
            )}
          </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
