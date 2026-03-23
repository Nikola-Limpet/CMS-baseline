'use client';

import Image from 'next/image';
import { ScrollReveal } from './scroll-reveal';

export function ProductShowcase() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
              The Dashboard
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">
              Everything at a glance.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mt-4">
              Monitor performance, manage content, and track analytics
              from a single, powerful interface.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-5xl mx-auto rounded-xl overflow-hidden border border-border shadow-elevation-lg">
            {/* Browser chrome bar */}
            <div className="h-9 bg-muted/60 border-b border-border flex items-center gap-1.5 px-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
            </div>

            {/* Screenshot */}
            <div className="relative aspect-[16/10]">
              <Image
                src="/images/landing/data_dashboard_real.png"
                alt="CMS analytics dashboard showing performance metrics, charts, and real-time data"
                fill
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1200px"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
