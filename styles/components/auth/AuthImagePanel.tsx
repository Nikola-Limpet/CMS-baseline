'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const slides = [
  { src: '/images/home/science_experiment_teaching.png', alt: 'Students learning science' },
  { src: '/images/home/stem_classroom_robotics.png', alt: 'Robotics classroom' },
  { src: '/images/home/public_stem_event.png', alt: 'Public STEM event' },
];

const mathSymbols = [
  { symbol: '∑', left: 12, top: 18 },
  { symbol: '∫', left: 78, top: 12 },
  { symbol: '∞', left: 22, top: 72 },
  { symbol: 'π', left: 85, top: 62 },
  { symbol: '√', left: 48, top: 22 },
  { symbol: 'Δ', left: 62, top: 82 },
  { symbol: 'θ', left: 8, top: 48 },
  { symbol: 'λ', left: 92, top: 38 },
];

export function AuthImagePanel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:block p-4 pr-0">
      <div className="relative h-full overflow-hidden rounded-2xl">
      {/* Background images — stacked, crossfade via opacity */}
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          priority={i === 0}
          sizes="50vw"
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Floating math symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mathSymbols.map(({ symbol, left, top }, index) => (
          <motion.div
            key={symbol}
            className="absolute text-white/15 text-3xl font-bold select-none"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              rotate: [0, 360],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 12 + index * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.6,
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between p-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/images/move-logo.png"
            alt="MOVE"
            width={48}
            height={48}
            className="rounded-lg"
          />
        </motion.div>

        {/* Headline */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
            Unlock Your
            <br />
            Mathematical Potential
          </h1>
          <p className="max-w-sm text-base text-white/80 leading-relaxed">
            Join Cambodia&apos;s premier STEM education platform. Learn from expert
            instructors and compete in international math olympiads.
          </p>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? 'w-8 bg-white' : 'w-4 bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
