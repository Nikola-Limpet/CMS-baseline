import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { connection } from 'next/server';
import { format } from 'date-fns';
import { Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { getUpcomingEvents, getPastEvents, getAllEventCategories } from '@/lib/dal';
import { Footer } from '@/components/layout/footer';
import { ScrollReveal } from '@/components/homepage/scroll-reveal';

export const metadata: Metadata = {
  title: 'Events - Nikola',
  description: 'Discover upcoming and past events.',
};

export default async function EventsPage() {
  await connection();

  const [upcoming, past, categories] = await Promise.all([
    getUpcomingEvents(20),
    getPastEvents(20),
    getAllEventCategories(),
  ]);

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy');
  };

  const formatFullDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-24 pb-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Events
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Upcoming events, competitions, and community gatherings.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Featured Upcoming Event */}
        {upcoming.length > 0 && (
          <section className="py-12 sm:py-16">
            <ScrollReveal>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-6">
                Next Up
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <Link
                href={`/events/${upcoming[0].slug}`}
                className="group block rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors no-underline"
              >
                <div className="flex flex-col lg:flex-row">
                  {upcoming[0].coverImage && (
                    <div className="relative lg:w-1/2 aspect-video lg:aspect-auto">
                      <Image
                        src={upcoming[0].coverImage}
                        alt={upcoming[0].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  )}
                  <div className={`p-8 md:p-10 ${upcoming[0].coverImage ? 'lg:w-1/2' : 'w-full'} flex flex-col justify-center`}>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatFullDate(upcoming[0].eventDate)}
                      </span>
                      {upcoming[0].location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {upcoming[0].location}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                      {upcoming[0].title}
                    </h2>
                    {upcoming[0].excerpt && (
                      <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                        {upcoming[0].excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                      View event details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </section>
        )}

        {/* Upcoming Events */}
        {upcoming.length > 1 && (
          <section className="pb-16">
            <ScrollReveal>
              <h2 className="text-2xl font-bold tracking-tight mb-8">Upcoming Events</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.slice(1).map((event, i) => (
                <ScrollReveal key={event.id} delay={Math.min(i * 0.08, 0.3)}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="group block rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-md transition-all no-underline"
                  >
                    {event.coverImage ? (
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={event.coverImage}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[3/2] bg-gradient-to-br from-muted to-accent flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.eventDate)}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {event.title}
                      </h3>
                      {event.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.excerpt}</p>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* No Upcoming Events */}
        {upcoming.length === 0 && (
          <section className="py-20 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No upcoming events</h2>
            <p className="text-muted-foreground">Check back soon for new events.</p>
          </section>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <section className="py-16 border-t border-border">
            <ScrollReveal>
              <h2 className="text-2xl font-bold tracking-tight mb-8">Past Events</h2>
            </ScrollReveal>
            <div className="space-y-4">
              {past.map((event, i) => (
                <ScrollReveal key={event.id} delay={Math.min(i * 0.05, 0.2)}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="group flex items-center gap-6 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors no-underline"
                  >
                    {event.coverImage && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                        <Image
                          src={event.coverImage}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.eventDate)}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
