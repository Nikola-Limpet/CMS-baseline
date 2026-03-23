'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { GridPattern } from '@/components/common/GridPattern';

const programs = [
  {
    name: 'College AP Program',
    description: 'College-level courses and exams that allow students to earn college credit.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
  },
  {
    name: 'STEM Program',
    description: 'Hands-on science, technology, engineering, and math education.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
  },
  {
    name: 'Arts Program',
    description: 'Visual arts, music, theater, and creative expression opportunities.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
  },
  {
    name: 'Athletics Program',
    description: 'Competitive and recreational sports for physical development and teamwork.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
  },
  {
    name: 'Languages Program',
    description: 'World languages curriculum including French, Spanish, Mandarin, and more.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
  },
  {
    name: 'Humanities Program',
    description: 'Deep exploration of history, philosophy, literature, and social sciences.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',
  },
];

export function ProgramsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProgram = programs[activeIndex];

  return (
    <section id="programs" className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - Title + Program List + Grid Pattern */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
                Programs
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-navy leading-snug mb-10">
                Student programs
                <br />
                you can register here
              </h2>

              <div className="space-y-1">
                {programs.map((program, i) => (
                  <button
                    key={program.name}
                    onClick={() => setActiveIndex(i)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                      i === activeIndex
                        ? 'text-navy font-medium'
                        : 'text-muted-foreground hover:text-navy/80'
                    }`}
                  >
                    {i === activeIndex && (
                      <span className="w-6 h-px bg-navy" />
                    )}
                    <span className="text-base">{program.name}</span>
                  </button>
                ))}
              </div>

              {/* Grid Pattern below program list */}
              <div className="mt-10 hidden lg:block">
                <GridPattern variant="light" rows={4} cols={5} cellSize={44} gap={4} />
              </div>
            </div>

            {/* Right - Images stacked + Tooltip */}
            <div className="space-y-5">
              {/* Top image with tooltip */}
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={activeProgram.image}
                    alt={activeProgram.name}
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Floating tooltip card */}
                <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-6 bg-white rounded-xl shadow-lg p-5 max-w-[240px] border border-gray-100">
                  <p className="text-sm text-navy/80 leading-relaxed">
                    {activeProgram.description}
                  </p>
                </div>
              </div>

              {/* Bottom video thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                  alt="Students in a classroom video"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 text-navy ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
