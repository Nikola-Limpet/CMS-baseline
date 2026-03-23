'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Database, ShieldCheck, Code2 } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

const features = [
  {
    icon: Database,
    title: 'PostgreSQL + Drizzle ORM',
    description: 'Type-safe queries, automatic migrations, and zero runtime overhead.',
  },
  {
    icon: ShieldCheck,
    title: 'Authentication Built In',
    description: 'Better Auth with OAuth, sessions, and role-based access control.',
  },
  {
    icon: Code2,
    title: 'End-to-End TypeScript',
    description: 'From database schema to React components — fully type-safe.',
  },
];

export function InfrastructureSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <ScrollReveal direction="left">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-border">
              <div className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[4/5]">
                <Image
                  src="/images/landing/server_real.png"
                  alt="Server infrastructure — reliable, scalable, enterprise-grade"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Text Column */}
          <ScrollReveal direction="right">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
                Infrastructure
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight leading-[1.15]">
                Built on solid ground.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-8">
                A modern stack designed for performance and developer experience.
                Every layer is type-safe, every tool is production-tested.
              </p>

              <div className="space-y-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-0.5">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary mt-8 no-underline"
              >
                Explore the stack
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
