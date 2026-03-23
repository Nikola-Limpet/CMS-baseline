'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  Globe,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
  backgroundImages?: string[];
  slideInterval?: number;
  titles?: string[];
  subtitles?: string[];
  ctas?: Array<{
    primary: string;
    secondary: string;
    primaryLink?: string;
    secondaryLink?: string;
  }>;
  primaryCta?: string;
  secondaryCta?: string;
  primaryCtaLink?: string;
  secondaryCtaLink?: string;
  features?: Array<{
    icon: React.ElementType;
    text: string;
  }>;
}

export function Hero({
  className,
  backgroundImages = ['/SCIA-14.jpg', '/SCIA-18.jpg', '/SCIA-66.jpg'],
  slideInterval = 6000,
  titles,
  subtitles,
  primaryCta,
  secondaryCta,
  primaryCtaLink,
  secondaryCtaLink,
  features = [
    { icon: GraduationCap, text: 'Academic Excellence' },
    { icon: Globe, text: 'Global Recognition' },
    { icon: BookOpen, text: 'Innovative Curriculum' },
  ],
}: HeroProps) {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Enhanced auto-slide with pause on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isAnimating) {
      interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentSlide(prev => (prev + 1) % backgroundImages.length);
          setIsAnimating(false);
        }, 1000);
      }, slideInterval);
    }
    return () => clearInterval(interval);
  }, [backgroundImages.length, slideInterval, isAnimating]);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Professional slide transition handler
  const handleSlideChange = (index: number) => {
    if (currentSlide === index) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section
      ref={heroRef}
      className={cn(
        'relative min-h-[90vh] mt-12  md:min-h-screen flex flex-col justify-center items-center overflow-hidden text-center',
        className
      )}
      onMouseEnter={() => setIsAnimating(true)}
      onMouseLeave={() => setIsAnimating(false)}
    >
      {/* Professional background with gradient overlay */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.05,
              filter: `blur(${currentSlide === index ? 0 : 8}px)`,
            }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
            {/* Modern gradient overlay with teal/navy color scheme */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/80 to-teal-900/70" />

            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-[0.04] mix-blend-overlay" />

            {/* Elegant accent lines */}
            <div className="absolute inset-0">
              <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />
              <div className="absolute top-[80%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content container with professional spacing */}
      <div className="container px-4 md:px-6 relative z-30">
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="flex flex-col items-center max-w-5xl mx-auto"
        >
          {/* Elegant slide counter with teal accent */}
          <div className="self-start mb-8 md:mb-12 flex items-center gap-3">
            <motion.span
              className="text-teal-400/25 font-semibold text-xl md:text-2xl"
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {String(currentSlide + 1).padStart(2, '0')}
            </motion.span>
            <div className="h-px w-20 bg-gradient-to-r from-teal-500/10 via-teal-400/30 to-teal-500/10" />
            <span className="text-white/40 font-medium text-lg">
              {String(backgroundImages.length).padStart(2, '0')}
            </span>
          </div>

          {/* Refined content section with enhanced typography */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full text-center space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">
                <span className="bg-gradient-to-r from-white via-white to-teal-100 bg-clip-text text-transparent">
                  {titles?.[currentSlide] || t('hero.title')}
                </span>
                <span className="block mt-2 text-teal-400 text-2xl md:text-3xl font-bold tracking-wide">
                  MOVE
                </span>
              </h1>

              <motion.p
                className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {subtitles?.[currentSlide] || t('hero.subtitle')}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Professional CTA buttons with refined hover effects */}
          <div className="flex flex-col sm:flex-row gap-5 mt-10 w-full max-w-md mx-auto">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-6 shadow-lg shadow-teal-900/20 hover:shadow-teal-900/30 transition-all border-0"
              asChild
            >
              <a href={primaryCtaLink || '#'}>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                  {primaryCta || t('hero.cta.primary')}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </Button>

            <Button
              size="lg"
              className="bg-transparent border-2 border-white/20 hover:border-teal-400/40 text-white hover:text-teal-100 rounded-full px-8 py-6 transition-colors group"
              asChild
            >
              <a href={secondaryCtaLink || '#'}>
                <span className="flex items-center justify-center gap-1 font-medium">
                  {secondaryCta || t('hero.cta.secondary')}
                  <ChevronRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                </span>
              </a>
            </Button>
          </div>

          {/* Modern feature cards with enhanced visual appeal */}
          <motion.div
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {features.map(({ icon: Icon, text }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-teal-400/30 transition-all cursor-pointer group hover:bg-white/8"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-3 bg-teal-500/10 rounded-full mb-4 group-hover:bg-teal-500/20 transition-colors">
                  <Icon className="w-7 h-7 text-teal-400" />
                </div>
                <span className="text-white font-medium text-lg text-center">
                  {text}
                </span>
                <div className="h-1 w-12 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent mt-4 group-hover:w-20 transition-all duration-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Professional slide indicators */}
          <div className="mt-16 flex items-center justify-center gap-3">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`relative h-2 transition-all duration-300 ${currentSlide === index ? 'w-12 bg-teal-400' : 'w-8 bg-white/20'} rounded-full overflow-hidden group hover:bg-white/40`}
                aria-label={`Slide ${index + 1}`}
              >
                {currentSlide === index && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-teal-500/20 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="absolute top-0 bottom-0 left-0 right-0 bg-white/20"
                      animate={{ x: ['0%', '100%'] }}
                      transition={{
                        duration: slideInterval / 1000,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Elegant section divider with teal accent */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="relative h-32">
          {/* Main divider shape */}
          <div
            className="absolute bottom-0 left-0 w-full h-32 bg-white"
            style={{ clipPath: 'polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)' }}
          />

          {/* Accent line */}
          <motion.div
            className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>
      </div>
    </section>
  );
}
