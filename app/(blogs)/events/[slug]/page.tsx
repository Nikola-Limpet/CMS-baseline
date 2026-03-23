import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, ExternalLink, ArrowRight, Clock } from 'lucide-react';
import { db } from '@/db';
import { events, eventCategories, eventPostCategories, user } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { Footer } from '@/components/layout/footer';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: 'Event Not Found' };
  }

  const ogImage = event.ogImage || event.coverImage;

  return {
    title: event.metaTitle || `${event.title} - Nikola Events`,
    description: event.metaDescription || event.excerpt || `Details for ${event.title}`,
    openGraph: {
      title: event.metaTitle || event.title,
      description: event.metaDescription || event.excerpt || undefined,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    ...(event.canonicalUrl ? { alternates: { canonical: event.canonicalUrl } } : {}),
    ...(event.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

async function getEventBySlug(slug: string) {
  try {
    const [event] = await db
      .select({
        id: events.id,
        title: events.title,
        slug: events.slug,
        content: events.content,
        excerpt: events.excerpt,
        coverImage: events.coverImage,
        published: events.published,
        publishedAt: events.publishedAt,
        eventDate: events.eventDate,
        eventEndDate: events.eventEndDate,
        location: events.location,
        registrationUrl: events.registrationUrl,
        userId: events.userId,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
        authorName: user.name,
        authorImage: user.image,
        metaTitle: events.metaTitle,
        metaDescription: events.metaDescription,
        ogImage: events.ogImage,
        canonicalUrl: events.canonicalUrl,
        noIndex: events.noIndex,
      })
      .from(events)
      .leftJoin(user, eq(events.userId, user.id))
      .where(eq(events.slug, slug))
      .limit(1);

    return event ?? null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

async function getEventCategories(eventId: string) {
  try {
    return await db
      .select({ id: eventCategories.id, name: eventCategories.name, slug: eventCategories.slug })
      .from(eventCategories)
      .innerJoin(eventPostCategories, eq(eventCategories.id, eventPostCategories.categoryId))
      .where(eq(eventPostCategories.eventId, eventId));
  } catch {
    return [];
  }
}

async function getRelatedEvents(currentId: string, limit: number = 3) {
  try {
    return await db
      .select({
        id: events.id,
        title: events.title,
        slug: events.slug,
        excerpt: events.excerpt,
        coverImage: events.coverImage,
        eventDate: events.eventDate,
        location: events.location,
      })
      .from(events)
      .where(and(eq(events.published, true), ne(events.id, currentId)))
      .limit(limit);
  } catch {
    return [];
  }
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || !event.published) {
    notFound();
  }

  const [categories, relatedEvents] = await Promise.all([
    getEventCategories(event.id),
    getRelatedEvents(event.id),
  ]);

  const displayDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  };

  const displayShortDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy');
  };

  const isUpcoming = new Date(event.eventDate) >= new Date();

  // Event content is authored by authenticated admins via the TipTap editor
  // and stored as trusted HTML in the database.
  const articleHtml = event.content;

  return (
    <div className="min-h-screen bg-background">

      {/* Article Header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40">

        {/* Category */}
        {categories.length > 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            {categories.map(c => c.name).join(', ')}
          </p>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight leading-[1.1] mb-6">
          {event.title}
        </h1>

        {/* Event Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-6">
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <Calendar className="h-4 w-4" />
            {displayDate(event.eventDate)}
            {event.eventEndDate && (
              <> — {displayDate(event.eventEndDate)}</>
            )}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          )}
          {isUpcoming && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Clock className="h-3 w-3" />
              Upcoming
            </span>
          )}
        </div>

        {/* Registration CTA */}
        {event.registrationUrl && isUpcoming && (
          <div className="mb-8">
            <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                Register Now
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        )}

        {/* Excerpt */}
        {event.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            {event.excerpt}
          </p>
        )}

        {/* Cover Image */}
        {event.coverImage && (
          <div className="mb-12">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-muted">
              <Image
                src={event.coverImage}
                alt={event.title || 'Event cover'}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          </div>
        )}
      </header>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <article>
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
            dangerouslySetInnerHTML={{ __html: articleHtml }}
          />

          {/* Registration CTA (bottom) */}
          {event.registrationUrl && isUpcoming && (
            <div className="border border-border rounded-lg p-6 mb-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Interested in attending?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Register now to secure your spot.
              </p>
              <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  Register <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          )}

          {/* Author */}
          <div className="border-t border-border pt-8 mb-16">
            <div className="flex items-center gap-3">
              {event.authorImage ? (
                <Image
                  src={event.authorImage}
                  alt={event.authorName || 'Author'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                  {event.authorName?.[0]?.toUpperCase() || 'A'}
                </div>
              )}
              <div>
                <p className="font-semibold text-sm">{event.authorName || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">
                  Posted {displayShortDate(event.publishedAt)}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className="text-2xl font-serif font-normal tracking-tight mb-8">
            More Events
          </h2>
          <div className="space-y-4">
            {relatedEvents.map(related => (
              <Link
                key={related.id}
                href={`/events/${related.slug}`}
                className="group flex items-center gap-6 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors no-underline"
              >
                {related.coverImage && (
                  <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="96px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                    {related.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {displayShortDate(related.eventDate)}
                    </span>
                    {related.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {related.location}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
