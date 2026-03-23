'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

const rows = [
  {
    image: '/images/home/stem_classroom_robotics.png',
    imageAlt: 'Students working with robotics in a STEM classroom',
    label: 'Our Mission',
    labelColor: 'text-teal-400',
    dotColor: 'bg-teal-400',
    heading: "Nurturing Tomorrow's Problem Solvers",
    headingKm: 'ចិញ្ចឹមអ្នកដោះស្រាយបញ្ហានាពេលអនាគត',
    description:
      'We cultivate critical thinking and creativity through hands-on STEM experiences, preparing students to tackle real-world challenges with confidence and ingenuity.',
    descriptionKm:
      'យើងបណ្តុះគំនិតវិភាគ និងភាពច្នៃប្រឌិតតាមរយៈបទពិសោធន៍ STEM ជាក់ស្ដែង ដោយរៀបចំសិស្សឱ្យដោះស្រាយបញ្ហាពិភពលោកពិតប្រាកដដោយទំនុកចិត្ត។',
    imagePosition: 'left' as const,
  },
  {
    image: '/images/home/science_experiment_teaching.png',
    imageAlt: 'Teacher guiding students through a science experiment',
    label: 'Our Approach',
    labelColor: 'text-amber-400',
    dotColor: 'bg-amber-400',
    heading: 'Where Science Meets Discovery',
    headingKm: 'កន្លែងដែលវិទ្យាសាស្ត្រជួបការរកឃើញ',
    description:
      'Our expert educators guide students through interactive experiments and competitions, transforming curiosity into mastery across mathematics, science, and technology.',
    descriptionKm:
      'គ្រូអ្នកជំនាញរបស់យើងណែនាំសិស្សតាមរយៈការពិសោធន៍អន្តរកម្ម និងការប្រកួតប្រជែង ដោយបំប្លែងការចង់ដឹងចង់ឃើញទៅជាជំនាញលើគណិតវិទ្យា វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា។',
    imagePosition: 'right' as const,
  },
];

export default function MissionSection() {
  const { language } = useLanguage();

  return (
    <section className="relative py-20 sm:py-28 bg-slate-900 overflow-hidden">
      {/* Grid pattern overlay (matches TestimonialsSection) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      {/* Soft glow accents */}
      <div className="absolute left-1/4 top-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-teal-500 opacity-10 blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-amber-500 opacity-10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {rows.map((row, idx) => {
          const isImageLeft = row.imagePosition === 'left';

          return (
            <div
              key={idx}
              className={cn(
                'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center',
                !isImageLeft && 'lg:[direction:rtl]'
              )}
            >
              {/* Image */}
              <motion.div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl lg:[direction:ltr]"
                initial={{ opacity: 0, x: isImageLeft ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <Image
                  src={row.image}
                  alt={row.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                />
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </motion.div>

              {/* Text */}
              <motion.div
                className="space-y-5 lg:[direction:ltr]"
                initial={{ opacity: 0, x: isImageLeft ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', row.dotColor)} />
                  <span className={cn('text-sm font-semibold uppercase tracking-wider', row.labelColor)}>
                    {row.label}
                  </span>
                </div>

                <h3
                  className={cn(
                    'text-3xl sm:text-4xl font-bold text-white leading-tight',
                    language === 'km' ? 'font-kantumruy' : ''
                  )}
                >
                  {language === 'km' ? row.headingKm : row.heading}
                </h3>

                <p
                  className={cn(
                    'text-lg text-slate-300 leading-relaxed',
                    language === 'km' ? 'font-kantumruy' : ''
                  )}
                >
                  {language === 'km' ? row.descriptionKm : row.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
