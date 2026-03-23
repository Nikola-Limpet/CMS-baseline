'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

function HeroItem({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-0 sm:pt-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Content area above image */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 mb-8 lg:mb-10">
          {/* Left: Large heading */}
          <HeroItem delay={0} className="flex-shrink-0 max-w-xl">
            <h1 className="text-5xl sm:text-6xl lg:text-[4.25rem] font-serif font-normal text-navy leading-[1.05] tracking-tight">
              Discover Your
              <br />
              Education{' '}
              <span className="italic">Potential</span>
            </h1>
          </HeroItem>

          {/* Right: Subtitle + CTA + Circle arrow */}
          <HeroItem delay={0.1} className="flex flex-col gap-6 lg:pb-1">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
              Our platform provides a dynamic environment that empowers creators to new heights.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/#about"
                className="inline-flex items-center px-8 py-3.5 bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors duration-300 no-underline"
              >
                Explore More
              </Link>
              {/* Circle arrow — concentric circles with dot */}
              <Link
                href="/#about"
                className="w-11 h-11 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy/5 transition-colors duration-300"
              >
                <div className="w-3 h-3 rounded-full border-2 border-navy flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-navy" />
                </div>
              </Link>
            </div>
          </HeroItem>
        </div>
      </div>

      {/* Full-width hero image — bleeds to edges */}
      <HeroItem delay={0.15}>
        <div className="relative w-full">
          <div className="aspect-[16/7] sm:aspect-[16/6]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80"
              alt="Team collaborating on creative content in a modern workspace"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </HeroItem>
    </section>
  );
}

export { HeroItem };
