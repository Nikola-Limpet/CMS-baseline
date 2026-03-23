'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Hash, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  element?: HTMLElement;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
  sticky?: boolean;
}

function extractHeadingsFromHTML(html: string): TableOfContentsItem[] {
  if (typeof window === 'undefined') return [];
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  return Array.from(headings).map((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent || '';
    const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
    
    return {
      id,
      text,
      level,
    };
  });
}

export function TableOfContents({ content, className, sticky = true }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [, setIsObserverReady] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const headings = useMemo(() => {
    if (!isClient || !content) return [];
    return extractHeadingsFromHTML(content);
  }, [content, isClient]);

  // Add IDs to actual DOM headings and set up intersection observer
  useEffect(() => {
    if (!isClient || headings.length === 0) return;

    let observer: IntersectionObserver | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const setupHeadingsAndObserver = () => {
      // Add IDs to headings in the actual DOM
      const blogContentContainer = document.querySelector('.blog-post-content, .blog-content');
      if (!blogContentContainer) {
        console.warn('Blog content container not found');
        return;
      }

      const actualHeadings = blogContentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      if (actualHeadings.length === 0) {
        console.warn('No headings found in blog content');
        return;
      }

      // Add IDs to headings without re-processing already processed ones
      actualHeadings.forEach((heading, index) => {
        if (!heading.id) {
          const text = heading.textContent || '';
          const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
          heading.id = id;
          
          // Add some padding-top for better scroll positioning
          const htmlHeading = heading as HTMLElement;
          if (!htmlHeading.style.paddingTop) {
            htmlHeading.style.paddingTop = '20px';
            htmlHeading.style.marginTop = '-20px';
          }
        }
      });

      // Set up intersection observer for active section highlighting
      observer = new IntersectionObserver(
        (entries) => {
          // Find the entry that's most in view
          const mostVisibleEntry = entries.find(entry => entry.isIntersecting);
          if (mostVisibleEntry) {
            setActiveId(mostVisibleEntry.target.id);
          }
        },
        {
          rootMargin: '-20% 0% -35% 0%',
          threshold: [0, 0.25, 0.5, 0.75, 1]
        }
      );

      // Observe all headings that have IDs
      actualHeadings.forEach((heading) => {
        if (heading.id && observer) {
          observer.observe(heading);
        }
      });

      setIsObserverReady(true);
    };

    // Single timeout to ensure DOM is ready
    timeoutId = setTimeout(setupHeadingsAndObserver, 100);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsObserverReady(false);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [headings.length, isClient]); // Only depend on headings.length, not the whole headings array

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Calculate offset for fixed header
      const headerHeight = 100; // Adjust this based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Don't set active state immediately - let the intersection observer handle it
      // This prevents the infinite re-render issue
    } else {
      console.warn(`Heading with id "${id}" not found in DOM`);
    }
  }, []);

  if (!isClient || headings.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm font-medium">
            <BookOpen className="w-4 h-4 mr-2" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm text-gray-500 py-4">
            {!isClient ? 'Loading...' : 'No headings found in content'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIndentLevel = (level: number) => {
    const baseIndent = level - 1;
    return Math.min(baseIndent * 16, 64); // Max indent of 64px
  };

  return (
    <Card className={cn('w-full', sticky && 'sticky top-24', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium">
          <BookOpen className="w-4 h-4 mr-2" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-full max-h-[60vh]">
          <nav className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  'w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200',
                  'hover:bg-muted hover:text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'flex items-start group border-l-2',
                  activeId === heading.id 
                    ? 'bg-primary/10 text-primary border-l-primary font-medium' 
                    : 'border-l-transparent text-muted-foreground hover:border-l-muted-foreground/50'
                )}
                style={{ paddingLeft: `${12 + getIndentLevel(heading.level)}px` }}
              >
                <Hash className="w-3 h-3 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                <span className="leading-5 break-words">{heading.text}</span>
              </button>
            ))}
          </nav>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Hook to get processed content with IDs
export function useTableOfContents(content: string) {
  const [processedContent, setProcessedContent] = useState(content);
  const [headings, setHeadings] = useState<TableOfContentsItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const extractedHeadings = extractHeadingsFromHTML(content);
      setHeadings(extractedHeadings);
      setProcessedContent(content);
    }
  }, [content]);

  return { processedContent, headings };
}

export default TableOfContents;