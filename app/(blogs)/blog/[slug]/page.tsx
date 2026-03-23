import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CalendarIcon,
  ArrowLeft,
  Clock,
  User,
  Tag,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import ShadcnBreadcrumb from '@/components/feature/ShadcnBreadcrumb';
import PostAnimatedHeader from './post-animated-header';
import { db } from '@/db';
import {
  blogPosts,
  blogCategories,
  blogTags,
  blogPostCategories,
  blogPostTags,
} from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import HtmlContentRenderer from '@/components/ui/html-content-renderer';
import TableOfContents from '@/components/blog/TableOfContents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import ShareButton from '@/components/blog/ShareButton';
import SimpleSaveButton from '@/components/blog/SimpleSaveButton';
import { Footer } from '@/components/layout/footer';


interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: `${post.title} - MOVE Blog`,
    description:
      post.excerpt || `Read about ${post.title} on MOVE Blog`,
    openGraph: post.coverImage
      ? {
          images: [{ url: post.coverImage }],
        }
      : undefined,
  };
}

// Utility function to estimate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

async function getBlogPostBySlug(slug: string) {
  try {
    const post = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    return post[0];
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getPostCategories(postId: string) {
  try {
    const categories = await db
      .select({
        id: blogCategories.id,
        name: blogCategories.name,
        slug: blogCategories.slug,
      })
      .from(blogCategories)
      .innerJoin(
        blogPostCategories,
        eq(blogCategories.id, blogPostCategories.categoryId)
      )
      .where(eq(blogPostCategories.postId, postId));

    return categories;
  } catch (error) {
    console.error('Error fetching post categories:', error);
    return [];
  }
}

async function getPostTags(postId: string) {
  try {
    const tags = await db
      .select({
        id: blogTags.id,
        name: blogTags.name,
        slug: blogTags.slug,
      })
      .from(blogTags)
      .innerJoin(blogPostTags, eq(blogTags.id, blogPostTags.tagId))
      .where(eq(blogPostTags.postId, postId));

    return tags;
  } catch (error) {
    console.error('Error fetching post tags:', error);
    return [];
  }
}

async function getRelatedPosts(currentPostId: string, limit: number = 3) {
  try {
    const related = await db
      .select()
      .from(blogPosts)
      .where(
        and(eq(blogPosts.published, true), ne(blogPosts.id, currentPostId))
      )
      .limit(limit);

    return related;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  // Fetch additional data
  const [categories, tags, relatedPosts] = await Promise.all([
    getPostCategories(post.id),
    getPostTags(post.id),
    getRelatedPosts(post.id),
  ]);

  // Format date for display
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'MMMM d, yyyy');
  };

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-[60vh] sm:min-h-[70vh]">
        {/* Animated Background */}
        <PostAnimatedHeader />
        
        {/* Breadcrumb Navigation */}
        <div className="absolute left-0 bottom-0 w-full z-30 pb-4 sm:pb-8 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <ShadcnBreadcrumb />
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-20 sm:pt-24 pb-16 sm:pb-24">
          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-12 sm:mb-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white/90 hover:text-white transition-all duration-300 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 group hover:scale-105"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="whitespace-nowrap">Back to Blog</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              <SimpleSaveButton
                postId={post.id}
                postTitle={post.title}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md hover:scale-105 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              />
              <ShareButton
                url={`/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt || ''}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md hover:scale-105 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center">
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {categories.map(category => (
                <Badge
                  key={category.id}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium backdrop-blur-sm"
                >
                  <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                  {category.name}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight sm:leading-tight bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent px-2 sm:px-0">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto font-light px-2 sm:px-0">
                {post.excerpt}
              </p>
            )}
            
            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-white/70 text-sm sm:text-base lg:text-lg">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">{readingTime}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">MOVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image - Smaller Size Display */}
      {post?.coverImage && (
        <div className="w-full bg-white py-4 sm:py-6 lg:py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full max-w-3xl mx-auto">
              {/* Image Container - Smaller Size */}
              <div className="relative w-full overflow-hidden rounded-xl shadow-lg bg-muted">
                <Image
                  src={post.coverImage}
                  alt={post.title || 'Blog post cover image'}
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                  sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 70vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                    display: 'block'
                  }}
                />
              </div>
              
              {/* Image Caption/Description if available */}
              {post.title && (
                <div className="mt-3 text-center">
                  <p className="text-sm text-muted-foreground italic">
                    Featured image for: {post.title}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Mobile TOC - Show above content on mobile */}
          <div className="lg:hidden">
            <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden mb-8">
              <div className="p-6 bg-primary text-primary-foreground">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Table of Contents
                </h3>
                <p className="text-primary-foreground/70 text-sm mt-1">Navigate through the article</p>
              </div>
              <div className="p-6">
                <TableOfContents content={post?.content || ''} sticky={false} />
              </div>
            </div>
          </div>

          {/* Main Article Content */}
          <article className="flex-1 w-full lg:max-w-4xl">
            {/* Article Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden mb-12">
              <div className="p-6 md:p-8 lg:p-12">
                {/* Article Tags */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-border">
                    {categories.map(category => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="px-4 py-2 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-all duration-300 rounded-full font-medium"
                      >
                        <Tag className="w-3.5 h-3.5 mr-2" />
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Blog Content */}
                <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:border prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/10 prose-blockquote:pl-6 prose-img:rounded-xl prose-img:shadow-lg">
                  <HtmlContentRenderer
                    content={post?.content || ''}
                    className="blog-post-content"
                  />
                </div>
                
                {/* Tags Section */}
                {tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary" />
                      Tagged with:
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {tags.map(tag => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground transition-all duration-300 rounded-full font-medium cursor-pointer"
                        >
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Author Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden mb-12">
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  {/* Author Info */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        M
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-foreground">MOVE Team</div>
                      <div className="text-muted-foreground text-sm">
                        Published {formatDate(post?.publishedAt)} • {readingTime}
                      </div>
                      <div className="text-muted-foreground text-sm mt-1">
                        Expert educators and content creators
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <SimpleSaveButton
                      postId={post.id}
                      postTitle={post.title}
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 px-6 py-3 rounded-full font-medium"
                      showText={true}
                    />

                    <ShareButton
                      url={`/blog/${post.slug}`}
                      title={post.title}
                      description={post.excerpt || ''}
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 px-6 py-3 rounded-full font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Enhanced Sidebar - Desktop only */}
          <aside className="hidden lg:block w-80 max-w-80">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="p-6 bg-primary text-primary-foreground">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Table of Contents
                  </h3>
                  <p className="text-primary-foreground/70 text-sm mt-1">Navigate through the article</p>
                </div>
                <div className="p-6">
                  <TableOfContents content={post?.content || ''} />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Enhanced Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Continue Reading
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover more insights and knowledge from our expert educators
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <Card
                  key={relatedPost.id}
                  className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl transform hover:-translate-y-2"
                >
                  <Link href={`/blog/${relatedPost.slug}`} className="block h-full">
                    {relatedPost.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title || 'Related article'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                        
                        {/* Date Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-gray-800 font-medium">
                            {formatDate(relatedPost.publishedAt)}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                          {relatedPost.excerpt}
                        </p>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button 
                asChild
                variant="outline" 
                className="px-8 py-6 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full font-medium group relative overflow-hidden"
              >
                <Link href="/blog" className="flex items-center gap-2">
                  <span className="relative z-10 flex items-center gap-2">
                    View All Articles
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}