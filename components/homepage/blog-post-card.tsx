'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import type { BlogPostWithAuthor } from '@/lib/dal';

export function BlogPostCard({ post, index, showReadOverlay = false }: { post: BlogPostWithAuthor; index: number; showReadOverlay?: boolean }) {
  return (
    <ScrollReveal delay={Math.min(index * 0.1, 0.3)}>
      <Link href={`/blog/${post.slug}`} className="group block no-underline bg-white rounded-xl overflow-hidden">
        {/* Thumbnail */}
        <div className="relative">
          {post.coverImage ? (
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title || 'Blog post'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* READ overlay for middle card */}
              {showReadOverlay && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-5 py-2 text-xs tracking-[0.2em] uppercase text-white font-medium border border-white/50 rounded-full">
                    Read
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[3/2] bg-cream flex items-center justify-center">
              <FileText className="w-10 h-10 text-navy/20" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs">
            {post.publishedAt && (
              <time dateTime={new Date(post.publishedAt).toISOString()} className="uppercase tracking-wider text-muted-foreground">
                {format(new Date(post.publishedAt), 'dd MMMM yyyy')}
              </time>
            )}
            {post.authorName && (
              <>
                <span className="flex-1" />
                <span className="text-muted-foreground">{post.authorName}</span>
              </>
            )}
          </div>

          <h3 className="text-base font-semibold leading-snug mt-3 text-navy group-hover:text-navy-light transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
        </div>
      </Link>
    </ScrollReveal>
  );
}
