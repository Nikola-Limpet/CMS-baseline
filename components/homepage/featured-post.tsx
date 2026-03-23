'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowRight, FileText, Clock } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import type { BlogPostWithAuthor } from '@/lib/dal';

function calculateReadingTime(content: string | null): string {
  if (!content) return '1 min';
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function FeaturedPost({ post }: { post: BlogPostWithAuthor }) {
  return (
    <ScrollReveal>
      <Link href={`/blog/${post.slug}`} className="group block no-underline">
        {/* Cover Image */}
        {post.coverImage ? (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title || 'Featured post'}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 1400px) 100vw, 1400px"
              priority
            />
          </div>
        ) : (
          <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-muted to-accent flex items-center justify-center">
            <FileText className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}

        {/* Content */}
        <div className="mt-8 max-w-3xl">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {post.authorName && <span className="font-medium text-foreground">{post.authorName}</span>}
            {post.publishedAt && (
              <time dateTime={new Date(post.publishedAt).toISOString()}>
                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </time>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {calculateReadingTime(post.content)}
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 leading-[1.15]">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-base text-muted-foreground leading-relaxed mt-4 max-w-2xl line-clamp-2">
              {post.excerpt}
            </p>
          )}

          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mt-6 group-hover:gap-3 transition-all duration-300">
            Read article <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </ScrollReveal>
  );
}
