"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Trophy, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const heroSlides = [
  {
    id: 1,
    image: '/SCIA-14.jpg',
    title: 'Excel in Mathematics',
    subtitle: 'International Standards',
    description: 'Unlock your potential with world-class instruction and global competitions.',
    cta: 'Start Learning',
    highlight: 'Featured Program',
    link: 'courses'
  },
  {
    id: 2,
    image: '/SCIA-18.jpg',
    title: 'Global Competitions',
    subtitle: 'Compete in Asia',
    description: 'Join thousands of students in our prestigious content competitions.',
    cta: 'View Competitions',
    highlight: 'Next Event',
    link: 'competitions'
  },
  {
    id: 3,
    image: '/SCIA-66.jpg',
    title: 'Expert Instruction',
    subtitle: 'Award-Winning Teachers',
    description: 'Get personalized attention in our state-of-the-art learning centers.',
    cta: 'Browse Courses',
    highlight: 'New Courses',
    link: 'courses'
  },
  {
    id: 4,
    image: '/SCIA-101.jpg',
    title: 'Academic Excellence',
    subtitle: 'Experienced Educators',
    description: 'Our dedicated teachers help you achieve mathematical mastery.',
    cta: 'Meet Teachers',
    highlight: 'Expert Faculty',
    link: 'about'
  },
  {
    id: 5,
    image: '/images/home/public_stem_event.png',
    title: 'STEM Events & Workshops',
    subtitle: 'Learn by Doing',
    description: 'Participate in hands-on STEM events that spark curiosity and build real-world skills.',
    cta: 'Explore Events',
    highlight: 'Upcoming Event',
    link: 'competitions'
  },
  {
    id: 6,
    image: '/images/home/stem_classroom_robotics.png',
    title: 'Robotics & Innovation',
    subtitle: 'Future-Ready Skills',
    description: 'Dive into robotics, coding, and engineering through our interactive classroom programs.',
    cta: 'Discover Programs',
    highlight: 'New Program',
    link: 'courses'
  }
];


export default function EnhancedHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const heroRef = useRef<HTMLElement>(null);
  useInView(heroRef, { once: true });
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -100]);
  
  // Preload images
  useEffect(() => {
    heroSlides.forEach((slide, index) => {
      const img = new window.Image();
      img.onload = () => {
        setImagesLoaded(prev => new Set([...prev, index]));
      };
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 150);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentHero = heroSlides[currentSlide];

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900"
    >
      {/* Background Image with Simple Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: parallaxY }}
      >
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentSlide ? 0.6 : 0,
                scale: index === currentSlide ? 1.05 : 1
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut"
              }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={`object-cover ${
                  imagesLoaded.has(index) ? 'opacity-100' : 'opacity-0'
                }`}
                priority={index === 0}
                quality={90}
                sizes="100vw"
                onLoad={() => {
                  setImagesLoaded(prev => new Set([...prev, index]));
                }}
              />
              <div className="absolute inset-0 bg-slate-900/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column - Minimal Content */}
          <div className="text-center lg:text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge 
                variant="outline" 
                className="text-white border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-sm font-medium rounded-full mb-6"
              >
                {currentHero.highlight}
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
                {currentHero.title}
              </h1>
              <p className="text-2xl sm:text-3xl text-white/80 font-light mb-6">
                {currentHero.subtitle}
              </p>
              <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                {currentHero.description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base font-semibold rounded-lg shadow-sm transition-all"
                asChild
              >
                <Link href={currentHero.link}>
                  {currentHero.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

          </div>

          {/* Right Column - Clean Cards */}
          <div className="hidden lg:block">
            <div className="space-y-4">
              <motion.div 
                className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Live Competitions</h3>
                    <p className="text-xs text-blue-200/80">Active Now</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300">Join real-time math competitions with students across Asia.</p>
              </motion.div>

              <motion.div 
                className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Expert Courses</h3>
                    <p className="text-xs text-emerald-200/80">Enroll Today</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300">Learn from award-winning instructors at our centers.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-8 h-1 bg-white' 
                : 'w-2 h-1 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
} 