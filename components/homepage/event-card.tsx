'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import type { EventWithAuthor } from '@/lib/dal';

export function EventCard({ event, index }: { event: EventWithAuthor; index: number }) {
  return (
    <ScrollReveal delay={Math.min(index * 0.1, 0.3)}>
      <div className="flex gap-5 items-start py-5 border-b border-gray-100 last:border-b-0">
        {/* Image */}
        {event.coverImage ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl bg-cream flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-navy/30" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-navy mb-2 line-clamp-1">
            {event.title}
          </h3>
          <div className="space-y-1">
            {event.eventDate && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <time dateTime={new Date(event.eventDate).toISOString()}>
                  {format(new Date(event.eventDate), 'dd MMMM yyyy')}
                </time>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Learn More */}
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-navy hover:text-navy-light transition-colors no-underline shrink-0 mt-1"
        >
          Learn More
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </ScrollReveal>
  );
}
