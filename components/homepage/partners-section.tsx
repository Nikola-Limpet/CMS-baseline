'use client';

import { ScrollReveal } from './scroll-reveal';

const partners = [
  { name: 'Logoipsum', style: 'font-bold' },
  { name: 'LOGOIPSUM', style: 'font-bold tracking-widest text-xs' },
  { name: 'Logoipsum', style: 'font-serif italic' },
  { name: 'LOGOIPSUM', style: 'font-medium tracking-[0.15em] text-sm' },
  { name: 'logoipsum', style: 'font-light lowercase tracking-tight' },
  { name: 'Logoipsum', style: 'font-bold text-sm' },
];

export function PartnersSection() {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
            {partners.map((partner, i) => (
              <span
                key={i}
                className={`text-lg sm:text-xl text-gray-300 select-none ${partner.style}`}
              >
                {partner.name}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
