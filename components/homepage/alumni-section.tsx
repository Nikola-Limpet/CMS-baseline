'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

const alumni = [
  {
    name: 'Alan Smith',
    year: '2010',
    occupation: 'Doctor at City Hospital',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Eva Rosanne',
    year: '2012',
    occupation: 'Librarian at State Library',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    name: 'Michael Chen',
    year: '2015',
    occupation: 'Software Engineer at Google',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    name: 'Sarah Johnson',
    year: '2018',
    occupation: 'Research Scientist at MIT',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
];

export function AlumniSection() {
  return (
    <section className="py-20 sm:py-28 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
                Alumni
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-navy leading-snug">
                The gallery of
                <br />
                our proud alumni
              </h2>
            </div>
            {/* Navigation arrows */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy/5 transition-colors" aria-label="Previous">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy/5 transition-colors" aria-label="Next">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {alumni.map((person, i) => (
            <ScrollReveal key={person.name} delay={i * 0.1}>
              <div className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <p className="text-xs text-navy/50 font-medium tracking-wider mb-1">{person.year}</p>
                <h3 className="text-base font-semibold text-navy">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.occupation}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
