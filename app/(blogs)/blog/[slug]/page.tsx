import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { db } from '@/db';
import {
  blogPosts,
  blogCategories,
  blogTags,
  blogPostCategories,
  blogPostTags,
  user,
} from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import TableOfContents from '@/components/blog/TableOfContents';
import ShareButton from '@/components/blog/ShareButton';
import SimpleSaveButton from '@/components/blog/SimpleSaveButton';
import { Footer } from '@/components/layout/footer';
import { format } from 'date-fns';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Blog Post Not Found' };
  }

  const ogImage = post.ogImage || post.coverImage;

  return {
    title: post.metaTitle || `${post.title} - Nikola Blog`,
    description: post.metaDescription || post.excerpt || `Read ${post.title} on Nikola Blog`,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    ...(post.canonicalUrl ? { alternates: { canonical: post.canonicalUrl } } : {}),
    ...(post.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

function calculateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

async function getBlogPostBySlug(slug: string) {
  try {
    const [post] = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        content: blogPosts.content,
        excerpt: blogPosts.excerpt,
        coverImage: blogPosts.coverImage,
        published: blogPosts.published,
        publishedAt: blogPosts.publishedAt,
        scheduledPublishAt: blogPosts.scheduledPublishAt,
        userId: blogPosts.userId,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: user.name,
        authorImage: user.image,
        authorBio: user.bio,
        metaTitle: blogPosts.metaTitle,
        metaDescription: blogPosts.metaDescription,
        ogImage: blogPosts.ogImage,
        canonicalUrl: blogPosts.canonicalUrl,
        noIndex: blogPosts.noIndex,
      })
      .from(blogPosts)
      .leftJoin(user, eq(blogPosts.userId, user.id))
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    return post ?? null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getPostCategories(postId: string) {
  try {
    return await db
      .select({ id: blogCategories.id, name: blogCategories.name, slug: blogCategories.slug })
      .from(blogCategories)
      .innerJoin(blogPostCategories, eq(blogCategories.id, blogPostCategories.categoryId))
      .where(eq(blogPostCategories.postId, postId));
  } catch {
    return [];
  }
}

async function getPostTags(postId: string) {
  try {
    return await db
      .select({ id: blogTags.id, name: blogTags.name, slug: blogTags.slug })
      .from(blogTags)
      .innerJoin(blogPostTags, eq(blogTags.id, blogPostTags.tagId))
      .where(eq(blogPostTags.postId, postId));
  } catch {
    return [];
  }
}

async function getRelatedPosts(currentPostId: string, limit: number = 3) {
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.published, true), ne(blogPosts.id, currentPostId)))
      .limit(limit);
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const [categories, tags, relatedPosts] = await Promise.all([
    getPostCategories(post.id),
    getPostTags(post.id),
    getRelatedPosts(post.id),
  ]);

  const displayDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'MMMM d, yyyy');
  };

  const readingTime = calculateReadingTime(post.content);

  // Blog content is authored by authenticated admins via the TipTap editor
  // and stored as trusted HTML in the database.
  const articleHtml = post.content;

  return (
    <div className="min-h-screen bg-background">

      {/* ─── Article Header (centered, narrow) ─── */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40">

        {/* Category */}
        {categories.length > 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            {categories.map(c => c.name).join(', ')}
          </p>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight leading-[1.1] mb-6">
          {post.title} —
        </h1>

        {/* Byline */}
        <div className="flex flex-wrap items-center gap-x-2 text-sm mb-6">
          <Link href="/blog" className="text-primary font-medium hover:underline">
            {post.authorName || 'Unknown'}
          </Link>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            Posted on {displayDate(post.publishedAt)}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{readingTime}</span>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            {post.excerpt}
          </p>
        )}

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-12">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-muted">
              <Image
                src={post.coverImage}
                alt={post.title || 'Blog post cover'}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          </div>
        )}
      </header>

      {/* ─── Article Body + Sidebar TOC ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex gap-12">

          {/* Main Content */}
          <article className="flex-1 max-w-3xl min-w-0">
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-foreground/80 prose-p:leading-[1.8]
                prose-li:text-foreground/80
                prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-2 prose-blockquote:border-foreground/20 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/60
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-[#0a0a0a] prose-pre:rounded-lg
                prose-img:rounded-lg
                mb-12"
            >
              <div
                dangerouslySetInnerHTML={{ __html: articleHtml }}
                className="blog-post-content"
              />
            </div>

            {/* ─── Tags ─── */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12">
                {tags.map(tag => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* ─── Author Bio ─── */}
            <div className="border-t border-border pt-8 mb-8">
              <div className="flex items-center gap-3 mb-3">
                {post.authorImage ? (
                  <Image
                    src={post.authorImage}
                    alt={post.authorName || 'Author'}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                    {post.authorName?.[0]?.toUpperCase() || 'A'}
                  </div>
                )}
                <div>
                  <Link href="/blog" className="text-primary font-semibold text-sm hover:underline">
                    {post.authorName || 'Unknown'}
                  </Link>
                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-primary/60 align-middle" />
                </div>
              </div>
              {post.authorBio && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl">
                  {post.authorBio}
                </p>
              )}
              <Link
                href="/blog"
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Check all posts
              </Link>
            </div>

            {/* ─── Share Row ─── */}
            <div className="flex items-center justify-between border-t border-border pt-6 mb-16">
              <div className="flex items-center gap-3">
                <ShareButton
                  url={`/blog/${post.slug}`}
                  title={post.title}
                  description={post.excerpt || ''}
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                />
                <SimpleSaveButton
                  postId={post.id}
                  postTitle={post.title}
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  showText
                />
              </div>
              <span className="text-sm text-muted-foreground hidden sm:inline">Share on Social Media</span>
            </div>
          </article>

          {/* ─── Sidebar TOC (desktop only) ─── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <TableOfContents content={articleHtml} sticky={false} />
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Related Posts ─── */}
      {relatedPosts.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className="text-2xl font-serif font-normal tracking-tight mb-8">
            Continue Reading
          </h2>

          <div className="space-y-6">
            {relatedPosts.map(relatedPost => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group block"
              >
                <div className="flex gap-6 items-start">
                  {relatedPost.coverImage && (
                    <div className="relative w-32 h-24 sm:w-40 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title || 'Related post'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="160px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-serif font-normal tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title} —
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-2 group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
