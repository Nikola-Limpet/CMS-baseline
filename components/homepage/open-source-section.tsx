'use client';

import Image from 'next/image';
import { Github, BookOpen } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

export function OpenSourceSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Column */}
          <ScrollReveal>
            <div className="max-w-lg">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
                Open Source
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">
                Free &amp; Open Source.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-8">
                Fork it, customize it, deploy it. This CMS is yours to own — no
                subscriptions, no limits, no vendor lock-in.
              </p>

              {/* Code snippet */}
              <div className="inline-block bg-[#0a0a0a] text-white/70 rounded-lg px-5 py-3 font-mono text-sm mb-8">
                <span className="text-white/30 select-none">$ </span>
                <span className="text-white/80">git clone</span>{' '}
                <span className="text-emerald-400/80">your-cms.git</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors no-underline"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors no-underline"
                >
                  <BookOpen className="w-4 h-4" />
                  Read the Blog
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Image Column */}
          <ScrollReveal direction="right">
            <div className="relative rounded-2xl overflow-hidden border border-border">
              <div className="aspect-square">
                <Image
                  src="/images/landing/workspace_open_source.png"
                  alt="Clean, sunlit workspace — open source means working on your own terms"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
