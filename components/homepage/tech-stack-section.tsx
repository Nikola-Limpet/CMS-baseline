'use client';

import { ScrollReveal } from './scroll-reveal';

const stack = [
  { name: 'Next.js 16', description: 'App Router' },
  { name: 'TypeScript', description: 'Type-safe' },
  { name: 'PostgreSQL', description: 'Database' },
  { name: 'Drizzle', description: 'ORM' },
  { name: 'Better Auth', description: 'Auth' },
  { name: 'TipTap', description: 'Editor' },
  { name: 'Tailwind', description: 'Styling' },
  { name: 'AWS S3', description: 'Storage' },
];

export function TechStackSection({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const isCompact = variant === 'compact';

  return (
    <section className={isCompact ? 'py-10 sm:py-14 border-t border-border' : 'py-20 sm:py-28 border-t border-border'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {!isCompact && (
          <ScrollReveal>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-8 text-center">
              Built With
            </p>
          </ScrollReveal>
        )}

        <ScrollReveal delay={isCompact ? 0 : 0.1}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-3xl mx-auto">
            {stack.map((item) => (
              <div
                key={item.name}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-muted/60 border border-border text-sm transition-colors hover:bg-muted"
              >
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="text-muted-foreground text-xs">{item.description}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
