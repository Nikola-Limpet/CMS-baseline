"use client";

import React from 'react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'High School Student',
    image: '/images/about/kh-student-test.jpg',
    content: "CMS has transformed my approach to mathematics. The interactive competitions helped me develop problem-solving skills I never knew I had!",
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Math Teacher',
    image: '/images/about/kru-somrong.jpg',
    content: "I was amazed by how engaged my students became with the competition platform. The gamified learning approach is truly revolutionary.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Thompson',
    role: 'Parent',
    image: '/images/about/kh-student-test.jpg',
    content: "My daughter's confidence in mathematics has grown tremendously. The personalized learning path and expert guidance made all the difference.",
    rating: 5,
  },
  {
    id: 4,
    name: 'David Patel',
    role: 'University Student',
    image: '/images/about/kru-somrong.jpg',
    content: "The advanced olympiad preparation courses prepared me perfectly for international competitions. I achieved results beyond my expectations.",
    rating: 5,
  },
  {
    id: 5,
    name: 'Sophia Kim',
    role: 'Middle School Student',
    image: '/images/about/kh-student-test.jpg',
    content: "Learning math has never been this fun! The step-by-step explanations and interactive problems make complex concepts easy to understand.",
    rating: 5,
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Education Director',
    image: '/images/about/kru-somrong.jpg',
    content: "CMS's comprehensive curriculum and expert instructors have significantly improved our students' mathematical performance across all levels.",
    rating: 5,
  },
];

/**
 * Bento grid layout mapping (desktop 3-col):
 *
 *  ┌──────────────────┬──────────┐
 *  │   card 0          │  card 1  │
 *  │  (2 col, 2 row)  ├──────────┤
 *  │   featured+image  │  card 2  │
 *  ├──────────┬────────┴──────────┤
 *  │  card 3  │   card 4          │
 *  ├──────────┤  (2 col, 2 row)  │
 *  │  card 5  │   featured+image  │
 *  └──────────┴───────────────────┘
 */

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const PersonInfo = ({ name, role, image, size = 'sm' }: { name: string; role: string; image: string; size?: 'sm' | 'lg' }) => (
  <div className="flex items-center gap-3">
    <div className={`relative rounded-full overflow-hidden border-2 border-white/20 shrink-0 ${size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'}`}>
      <Image src={image} alt={name} fill className="object-cover" />
    </div>
    <div>
      <div className={`font-bold text-white ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>{name}</div>
      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">{role}</div>
    </div>
  </div>
);

/** Featured card: large image + overlaid quote (spans 2 cols & 2 rows) */
function FeaturedCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden h-full min-h-[320px] group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* Background image */}
      <Image
        src={t.image}
        alt={t.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 66vw"
        quality={85}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/20" />

      {/* Content positioned at bottom */}
      <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
        <Quote className="w-8 h-8 text-amber-400/60 mb-3" />
        <blockquote className="text-white text-lg sm:text-xl leading-relaxed font-light mb-5 max-w-lg">
          &ldquo;{t.content}&rdquo;
        </blockquote>
        <div className="flex items-center justify-between">
          <PersonInfo name={t.name} role={t.role} image={t.image} size="lg" />
          <Stars count={t.rating} />
        </div>
      </div>
    </motion.div>
  );
}

/** Standard compact card: text-focused */
function CompactCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      className="rounded-2xl bg-slate-800/50 border border-slate-700/40 p-6 flex flex-col h-full hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Stars count={t.rating} />

      <blockquote className="text-slate-200 text-sm sm:text-base leading-relaxed mt-4 mb-6 font-light italic flex-grow">
        &ldquo;{t.content}&rdquo;
      </blockquote>

      <PersonInfo name={t.name} role={t.role} image={t.image} />
    </motion.div>
  );
}

export default function TestimonialsSection() {
  // Split: featured cards (index 0, 4) get the large treatment
  const featured1 = testimonials[0];
  const small1 = testimonials[1];
  const small2 = testimonials[2];
  const small3 = testimonials[3];
  const featured2 = testimonials[4];
  const small4 = testimonials[5];

  return (
    <section className="py-20 sm:py-28 bg-slate-900 relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-1/3 top-0 h-[400px] w-[400px] rounded-full bg-blue-500 opacity-[0.08] blur-[120px]" />
      <div className="absolute right-1/4 bottom-0 h-[350px] w-[350px] rounded-full bg-teal-500 opacity-[0.08] blur-[120px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-300 mb-5">
            <span className="w-2 h-2 bg-amber-400 rounded-full" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Success Stories</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Hear from our students, teachers, and parents about their experience.
          </p>
        </motion.div>

        {/* ── Bento Grid ── */}
        {/* Desktop: 3 columns, featured cards span 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 auto-rows-[minmax(180px,auto)]">
          {/* Featured 1: top-left, spans 2 cols & 2 rows */}
          <div className="lg:col-span-2 lg:row-span-2">
            <FeaturedCard t={featured1} index={0} />
          </div>
          {/* Small 1: top-right */}
          <div>
            <CompactCard t={small1} index={1} />
          </div>
          {/* Small 2: below small 1 */}
          <div>
            <CompactCard t={small2} index={2} />
          </div>

          {/* Small 3: bottom-left */}
          <div>
            <CompactCard t={small3} index={3} />
          </div>
          {/* Featured 2: bottom-right, spans 2 cols & 2 rows */}
          <div className="lg:col-span-2 lg:row-span-2">
            <FeaturedCard t={featured2} index={4} />
          </div>
          {/* Small 4: below small 3 */}
          <div>
            <CompactCard t={small4} index={5} />
          </div>
        </div>
      </div>
    </section>
  );
}
