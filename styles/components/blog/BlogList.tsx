'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Search,
  Grid,
  List,
  ArrowRight,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  userId: string;
  categories?: { id: string; name: string; slug: string }[];
  tags?: { id: string; name: string; slug: string }[];
  readingTime?: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

interface BlogListProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
}

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'title';

export default function BlogList({ initialPosts, categories, tags }: BlogListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[] | null>(null);
  const [, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const hasActiveFiltersForFetch = searchTerm || selectedCategory !== 'all' || selectedTags.length > 0;

  // Fetch posts when filters change
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
      params.set('published', 'true');
      params.set('withRelations', 'true');
      params.set('limit', '40');

      const response = await fetch(`/api/blogs?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      const data = await response.json();
      setFetchedPosts(data);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to fetch'));
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedTags]);

  // Fetch when filters change (debounced for search)
  useEffect(() => {
    if (hasActiveFiltersForFetch) {
      const timer = setTimeout(() => fetchPosts(), 300);
      return () => clearTimeout(timer);
    } else {
      setFetchedPosts(null);
    }
  }, [searchTerm, selectedCategory, selectedTags, hasActiveFiltersForFetch, fetchPosts]);

  // Use fetched posts when filters active, otherwise use initial SSR posts
  const allPosts = fetchedPosts ?? initialPosts;

  // Sort posts (filtering is now handled by React Query)
  const filteredAndSortedPosts = useMemo(() => {
    const posts = [...allPosts];

    // Sort posts (server already handles filtering)
    posts.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt || b.createdAt).getTime() - 
                 new Date(a.publishedAt || a.createdAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt || a.createdAt).getTime() - 
                 new Date(b.publishedAt || b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return posts;
  }, [allPosts, sortBy]);

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredAndSortedPosts.slice(startIndex, endIndex);
  }, [filteredAndSortedPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);

  // Add/remove tag filter
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setSortBy('newest');
  };

  // Format dates
  const formatFullDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedTags.length > 0;

  if (isError) {
    return (
      <Card className="p-16 text-center bg-white border-0 shadow-xl rounded-2xl">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">Error Loading Articles</h3>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            {error instanceof Error ? error.message : 'Failed to load articles. Please try again.'}
          </p>
          <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Row */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search articles, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-white border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px] h-10 rounded-lg border border-gray-200">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[130px] h-10 rounded-lg border border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tags Row */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Results count when filtering */}
        {hasActiveFilters && (
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedPosts.length} article{filteredAndSortedPosts.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Posts Display */}
      {paginatedPosts.length === 0 ? (
        <Card className="p-16 text-center bg-white border-0 shadow-xl rounded-2xl">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">No Articles Found</h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              No articles match your current filters. Try adjusting your search criteria.
            </p>
            <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90">
              Clear Filters
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Posts Grid/List */}
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }>
            {paginatedPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className={`group h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl transform hover:-translate-y-2 ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}
              >
                <Link href={`/blog/${post.slug}`} className={`block ${viewMode === 'list' ? 'flex w-full' : 'h-full'}`}>
                  {post.coverImage && (
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' 
                        ? 'w-1/3 h-48' 
                        : 'h-52'
                    }`}>
                      <Image
                        src={post.coverImage}
                        alt={post.title || 'Blog post'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes={viewMode === 'list' ? '300px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                      
                      {/* Article Number (Grid only) */}
                      {viewMode === 'grid' && (
                        <div className="absolute top-4 left-4">
                          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-bold text-gray-800">
                            {(currentPage - 1) * postsPerPage + index + 1}
                          </div>
                        </div>
                      )}

                      {/* Date Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-gray-800 font-medium">
                          {formatFullDate(post.publishedAt)}
                        </div>
                      </div>

                      {/* Reading Time */}
                      {post.readingTime && (
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-gray-800 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readingTime}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardContent className={`p-6 flex flex-col h-full ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex-1">
                      <h3 className={`font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight ${
                        viewMode === 'list' ? 'text-lg' : 'text-xl'
                      }`}>
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className={`text-muted-foreground mb-4 line-clamp-3 leading-relaxed ${
                          viewMode === 'list' ? 'text-sm' : ''
                        }`}>
                          {post.excerpt}
                        </p>
                      )}

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge 
                              key={tag.id} 
                              variant="secondary" 
                              className="text-xs px-2 py-1"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
                          SE
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">MOVE</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all duration-300">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2"
              >
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10 h-10 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2"
              >
                Next
              </Button>
            </div>
          )}

        </>
      )}
    </div>
  );
}