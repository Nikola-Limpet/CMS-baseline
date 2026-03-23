'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import { ArrowUpRight } from 'lucide-react';

const galleryItems = [
  {
    label: 'Study Activities',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80',
    hasViewButton: true,
  },
  {
    label: 'Sport Activities',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
    hasViewButton: false,
  },
  {
    label: 'Lab Activities',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    hasViewButton: false,
  },
  {
    label: 'Art Classes',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
    hasViewButton: false,
  },
];

export function GallerySection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Tall image with VIEW button */}
          <ScrollReveal>
            <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden group cursor-pointer">
              <Image
                src={galleryItems[0].image}
                alt={galleryItems[0].label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Label */}
              <div className="absolute top-5 left-5">
                <span className="text-sm font-medium text-white">{galleryItems[0].label}</span>
              </div>
              {/* Circular VIEW button */}
              <div className="absolute bottom-8 left-8">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-navy text-xs tracking-[0.15em] uppercase font-medium shadow-lg group-hover:scale-110 transition-transform duration-300">
                  View
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - Grid of smaller images + heading */}
          <div className="flex flex-col gap-5">
            {/* Top row: Sport Activities + Header */}
            <div className="grid grid-cols-2 gap-5">
              <ScrollReveal delay={0.08}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer">
                  <Image
                    src={galleryItems[1].image}
                    alt={galleryItems[1].label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-medium text-white">{galleryItems[1].label}</span>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <div className="flex flex-col justify-center">
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-3">
                    Gallery
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-serif font-normal text-navy leading-snug">
                    Students life
                    <br />
                    at Nikola
                  </h2>
                </div>
              </ScrollReveal>
            </div>

            {/* Description + Explore More */}
            <ScrollReveal delay={0.15}>
              <div className="flex items-start justify-between gap-6">
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  From academic achievements to extracurricular activities, these snapshots of vibrant,
                  dynamic life at Bright High School give a glimpse into the experiences and...
                </p>
                <Link
                  href="/#gallery"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-navy/20 rounded-full text-xs font-medium text-navy hover:bg-navy/5 transition-colors no-underline whitespace-nowrap"
                >
                  Explore More
                </Link>
              </div>
            </ScrollReveal>

            {/* Bottom row: 2 more images */}
            <div className="grid grid-cols-2 gap-5">
              {galleryItems.slice(2).map((item, i) => (
                <ScrollReveal key={item.label} delay={0.18 + i * 0.06}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xs font-medium">{item.label}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
