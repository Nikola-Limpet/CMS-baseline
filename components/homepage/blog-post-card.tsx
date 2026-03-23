'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowRight, FileText } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import type { BlogPostWithAuthor } from '@/lib/dal';

function calculateReadingTime(content: string | null): string {
  if (!content) return '1 min';
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function BlogPostCard({ post, index }: { post: BlogPostWithAuthor; index: number }) {
  return (
    <ScrollReveal delay={Math.min(index * 0.1, 0.3)}>
      <Link href={`/blog/${post.slug}`} className="group block no-underline">
        {/* Thumbnail */}
        {post.coverImage ? (
          <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title || 'Blog post'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[3/2] rounded-xl bg-gradient-to-br from-muted to-accent flex items-center justify-center">
            <FileText className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}

        {/* Text Content */}
        <div className="mt-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {post.authorName && <span>{post.authorName}</span>}
            {post.publishedAt && (
              <time dateTime={new Date(post.publishedAt).toISOString()}>
                {format(new Date(post.publishedAt), 'MMM d, yyyy')}
              </time>
            )}
            <span>{calculateReadingTime(post.content)}</span>
          </div>

          <h3 className="text-lg font-semibold leading-snug mt-2 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mt-3 group-hover:gap-3 transition-all duration-300">
            Read more <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </ScrollReveal>
  );
}
