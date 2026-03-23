'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import { GraduationCap, Users, Heart, ArrowUpRight } from 'lucide-react';
import { GridPattern } from '@/components/common/GridPattern';

const features = [
  {
    icon: GraduationCap,
    title: 'Academic Excellence',
    description: 'Our rigorous curriculum ensures students are well-prepared for college and life beyond.',
  },
  {
    icon: Users,
    title: 'Experienced Faculty',
    description: 'Our dedicated teachers are passionate about education and student success.',
  },
  {
    icon: Heart,
    title: 'Supportive Community',
    description: 'We foster a strong sense of community and belonging for all students on board.',
  },
];

const awards = [
  { label: '#1 Community Service', hasUnderline: true },
  { label: 'Innovative Teacher Award', hasUnderline: false },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28">
      {/* Navy About Block */}
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left - Navy block + image */}
            <div className="space-y-6">
              <div className="bg-navy rounded-2xl p-10 sm:p-12">
                <p className="text-xs tracking-[0.2em] uppercase text-white/60 font-medium mb-4">
                  About
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white leading-snug">
                  Unleash students
                  <br />
                  possibilities with us
                </h2>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                  alt="Students studying together in a collaborative environment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Right - Grid pattern + description */}
            <div className="flex flex-col h-full pt-4">
              {/* Grid Pattern decoration */}
              <div className="mb-8 hidden lg:block">
                <GridPattern variant="light" rows={4} cols={5} cellSize={48} gap={4} />
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Unlocking every student&apos;s potential by offering a stimulating and supportive
                environment is what we offer. Our innovative education encourages students to explore.
              </p>
              <Link
                href="/#programs"
                className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-navy-light transition-colors no-underline group"
              >
                Learn More
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Features Row */}
      <div className="container mx-auto px-4 lg:px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-navy/10 mb-5">
                  <feature.icon className="w-6 h-6 text-navy" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Awards Row */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {/* Grid pattern on left */}
            <div className="hidden lg:block">
              <GridPattern variant="light" rows={3} cols={4} cellSize={36} gap={3} />
            </div>
            {awards.map((award) => (
              <div key={award.label} className="text-center">
                <p className="text-lg sm:text-xl font-bold text-navy">{award.label}</p>
                {award.hasUnderline && (
                  <div className="w-16 h-1 bg-navy mx-auto mt-2" />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
