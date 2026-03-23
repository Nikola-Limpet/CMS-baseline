'use client';

import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import type { Testimonial } from '@/db/schema';

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-white/40 font-medium mb-4">
              Testimonials
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-white">
              What people say.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <ScrollReveal key={testimonial.id} delay={i * 0.08}>
              <div className="p-6 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-colors h-full flex flex-col">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-white/10 mb-4 flex-shrink-0" />

                {/* Content */}
                <p className="text-sm text-white/70 leading-relaxed flex-1 mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3.5 w-3.5 ${
                          j < testimonial.rating!
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/10'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-3">
                  {testimonial.authorImage ? (
                    <Image
                      src={testimonial.authorImage}
                      alt={testimonial.authorName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 font-semibold text-sm">
                      {testimonial.authorName[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{testimonial.authorName}</p>
                    {testimonial.authorTitle && (
                      <p className="text-xs text-white/40">{testimonial.authorTitle}</p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
