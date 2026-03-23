import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BlogList from '@/components/blog/BlogList';
import { Footer } from '@/components/layout/footer';
import {
  getFeaturedBlogPost,
  getAllBlogCategories,
  getAllBlogTags,
  getPublishedBlogs,
} from '@/lib/dal';
import type { BlogPostWithAuthor } from '@/lib/dal';

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export default async function BlogPage() {
  const [featuredPost, categories, tags, posts] = await Promise.all([
    getFeaturedBlogPost(),
    getAllBlogCategories(),
    getAllBlogTags(),
    getPublishedBlogs(20),
  ]);

  const recentPosts = featuredPost
    ? posts.filter(post => post.id !== featuredPost.id).slice(0, 8)
    : posts.slice(0, 8);

  const formatFullDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header Section */}
      <section className="pt-24 pb-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Thoughts on web development, design, and building in the open.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Article */}
        {featuredPost && (
          <section className="py-12">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Featured Article
            </h2>

            <Card className="overflow-hidden border border-gray-200 shadow-lg bg-white rounded-2xl">
              <div className="lg:flex">
                {featuredPost.coverImage && (
                  <div className="lg:w-1/2 relative h-80 lg:h-auto">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title || 'Featured article'}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Reading Stats */}
                    <div className="absolute bottom-6 left-6 flex gap-3">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-gray-800 font-medium">
                        <Clock className="w-4 h-4 inline mr-1.5" />
                        {calculateReadingTime(featuredPost.content)}
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-gray-800 font-medium">
                        <CalendarIcon className="w-4 h-4 inline mr-1.5" />
                        {formatFullDate(featuredPost.publishedAt)}
                      </div>
                    </div>
                  </div>
                )}

                <div className={`${featuredPost.coverImage ? 'lg:w-1/2' : 'w-full'} p-8 md:p-12`}>
                  <div className="flex items-center gap-3 mb-6">
                    {featuredPost.authorImage ? (
                      <Image
                        src={featuredPost.authorImage}
                        alt={featuredPost.authorName || 'Author'}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                        {featuredPost.authorName?.[0]?.toUpperCase() || 'A'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground text-sm">{featuredPost.authorName || 'Unknown'}</div>
                      <div className="text-muted-foreground text-xs">{formatFullDate(featuredPost.publishedAt)} · {calculateReadingTime(featuredPost.content)}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-foreground">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="hover:text-primary transition-colors duration-300"
                    >
                      {featuredPost.title}
                    </Link>
                  </h3>

                  {featuredPost.excerpt && (
                    <p className="text-base text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  )}

                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-xl font-semibold"
                  >
                    <Link href={`/blog/${featuredPost.slug}`} className="flex items-center gap-2">
                      Read Full Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Blog List with Search and Filters */}
        <BlogList
          initialPosts={recentPosts}
          categories={categories}
          tags={tags}
        />
      </div>

      <Footer />
    </div>
  );
}
