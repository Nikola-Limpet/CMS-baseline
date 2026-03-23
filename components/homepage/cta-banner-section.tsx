'use client';

import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';

export function CTABannerSection() {
  return (
    <section className="py-20 sm:py-28 bg-navy">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white leading-snug">
              Ready to Join Our High
              <br />
              School Community?
            </h2>
            <p className="text-white/60 mt-4 mb-8 text-base leading-relaxed max-w-lg">
              Discover a supportive community dedicated to academic excellence and personal growth.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center px-8 py-3.5 border border-white/30 text-white rounded-full text-sm font-medium hover:bg-white/10 transition-colors duration-300 no-underline"
            >
              Enroll Now
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
