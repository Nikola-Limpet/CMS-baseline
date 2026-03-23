'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { BlogPost } from '@/db/schema';

interface BlogWithAuthor extends BlogPost {
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

interface ImageLoadState {
  [key: string]: boolean;
}

interface LatestBlogsProps {
  blogs: BlogWithAuthor[];
}

export function LatestBlogs({ blogs }: LatestBlogsProps) {
  const [imageLoadStates, setImageLoadStates] = useState<ImageLoadState>({});

  const formatDate = (date: string | Date | null) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    // Remove HTML tags and get plain text excerpt
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.slice(0, maxLength).trim() + '...';
  };

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-brand-blue-600 bg-brand-blue-100">
            <BookOpen className="w-4 h-4 mr-1" />
            Latest Articles
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Educational Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest educational articles, study tips, and mathematical insights
          </p>
        </div>

        {/* Enhanced Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white border-0 shadow-lg hover:shadow-brand-blue-500/20"
              >
                {/* Enhanced Cover Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-blue-50 to-brand-teal-50">
                  {blog.coverImage ? (
                    <>
                      {/* Loading placeholder */}
                      {!imageLoadStates[blog.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-100 to-brand-teal-100 animate-pulse">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]" />
                        </div>
                      )}
                      
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                          imageLoadStates[blog.id] ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
                        }`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={85}
                        onLoad={() => {
                          setImageLoadStates(prev => ({ ...prev, [blog.id]: true }));
                        }}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-blue-100 to-brand-teal-100 flex items-center justify-center group-hover:from-brand-blue-200 group-hover:to-brand-teal-200 transition-all duration-300">
                      <BookOpen className="w-12 h-12 text-brand-blue-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                  
                  {/* Enhanced overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating read indicator */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Read More
                  </div>
                </div>

                {/* Enhanced Content */}
                <CardContent className="p-6">
                  {/* Enhanced Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3 text-brand-blue-500" />
                      <span className="text-xs font-medium">{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                    {blog.author && (
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
                        <User className="w-3 h-3 text-brand-teal-500" />
                        <span className="text-xs font-medium">
                          {blog.author.firstName && blog.author.lastName
                            ? `${blog.author.firstName} ${blog.author.lastName}`
                            : 'MOVE Team'
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-blue-600 transition-colors duration-300 leading-tight">
                    {blog.title}
                  </h3>

                  {/* Enhanced Excerpt */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                    {blog.excerpt || getExcerpt(blog.content)}
                  </p>

                  {/* Enhanced Read More Link */}
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-brand-blue-600 hover:text-brand-blue-700 font-semibold text-sm transition-all duration-300 group/link"
                  >
                    <span className="relative">
                      Read More
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue-600 transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced View All Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:from-brand-blue-700 hover:to-brand-teal-700 text-white shadow-lg hover:shadow-xl hover:shadow-brand-blue-500/25 transition-all duration-300 px-8 py-4 rounded-xl group"
          >
            <Link href="/blog" className="flex items-center gap-2">
              <span>View All Articles</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 