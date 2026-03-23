"use client";

import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

export default function PostAnimatedHeader() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for mobile device
    setIsMobile(window.innerWidth < 768);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    
    window.addEventListener('resize', handleResize);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Mouse parallax effect (disabled on mobile for performance)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile || prefersReducedMotion) return;
    
    const rect = (e.currentTarget as HTMLElement)?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      });
    }
  }, [isMobile, prefersReducedMotion]);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    
    const element = document.querySelector('.galaxy-container');
    if (element) {
      element.addEventListener('mousemove', handleMouseMove as EventListener);
      return () => element.removeEventListener('mousemove', handleMouseMove as EventListener);
    }
  }, [handleMouseMove, isMobile, prefersReducedMotion]);

  // Performance-optimized star counts
  const starCounts = {
    distant: isMobile ? 20 : prefersReducedMotion ? 30 : 60,
    medium: isMobile ? 15 : prefersReducedMotion ? 20 : 40,
    close: isMobile ? 10 : prefersReducedMotion ? 15 : 25,
  };

  // Animation settings based on device capabilities
  const animationSettings = {
    duration: prefersReducedMotion ? 0 : isMobile ? 0.3 : 1,
    parallaxMultiplier: prefersReducedMotion ? 0 : isMobile ? 2 : 1,
  };

  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-blue-900/10 to-indigo-900/20" />
      </div>
    );
  }

  return (
    <div className="galaxy-container absolute inset-0 overflow-hidden z-0">
      {/* Deep Space Background with Aurora */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900" />
        
        {/* Aurora Borealis Effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 20%, rgba(34,197,94,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.2) 0%, transparent 50%)',
              'radial-gradient(ellipse at 30% 40%, rgba(168,85,247,0.25) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(34,197,94,0.2) 0%, transparent 50%)',
              'radial-gradient(ellipse at 40% 60%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(ellipse at 60% 40%, rgba(168,85,247,0.2) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Cosmic dust overlay */}
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.svg')] bg-repeat opacity-5" />
        
        {/* Atmospheric shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/1 to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Parallax Star Layers */}
      {/* Layer 1: Distant stars (slowest) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x * 5 * animationSettings.parallaxMultiplier,
          y: mousePosition.y * 5 * animationSettings.parallaxMultiplier,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {/* Distant tiny stars */}
        {Array.from({ length: starCounts.distant }, (_, i) => (
          <motion.div
            key={`distant-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.div>
      
      {/* Layer 2: Medium distance stars */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x * 10 * animationSettings.parallaxMultiplier,
          y: mousePosition.y * 10 * animationSettings.parallaxMultiplier,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 30 }}
      >
        {Array.from({ length: starCounts.medium }, (_, i) => (
          <motion.div
            key={`medium-${i}`}
            className="absolute w-1 h-1 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#FFFFFF', '#60A5FA', '#A78BFA', '#22D3EE', '#34D399'][Math.floor(Math.random() * 5)],
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </motion.div>
      
      {/* Layer 3: Close bright stars */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x * 15 * animationSettings.parallaxMultiplier,
          y: mousePosition.y * 15 * animationSettings.parallaxMultiplier,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        {Array.from({ length: starCounts.close }, (_, i) => (
          <motion.div
            key={`close-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#FFFFFF', '#60A5FA', '#A78BFA', '#F472B6', '#22D3EE'][Math.floor(Math.random() * 5)],
              filter: 'drop-shadow(0 0 4px currentColor)',
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Constellation Patterns */}
      <motion.svg
        className="absolute inset-0 w-full h-full opacity-40"
        viewBox="0 0 1440 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        transition={{ staggerChildren: 0.5 }}
      >
        {/* Big Dipper Constellation */}
        <g opacity="0.6">
          {/* Stars */}
          <motion.circle cx="200" cy="80" r="2" fill="#FFFFFF" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 2 }} />
          <motion.circle cx="240" cy="70" r="1.5" fill="#60A5FA" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 2.2 }} />
          <motion.circle cx="280" cy="65" r="1.8" fill="#FFFFFF" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 2.4 }} />
          <motion.circle cx="320" cy="75" r="1.6" fill="#A78BFA" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 2.6 }} />
          <motion.circle cx="340" cy="110" r="1.7" fill="#FFFFFF" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 2.8 }} />
          <motion.circle cx="310" cy="140" r="1.5" fill="#22D3EE" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 3 }} />
          <motion.circle cx="270" cy="130" r="1.4" fill="#FFFFFF" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 3.2 }} />
          
          {/* Constellation lines */}
          <motion.path
            d="M200,80 L240,70 L280,65 L320,75 M320,75 L340,110 L310,140 L270,130"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4 } }}
            transition={{ duration: 3, delay: 3.5 }}
          />
        </g>

        {/* Orion's Belt */}
        <g opacity="0.5">
          <motion.circle cx="900" cy="120" r="1.8" fill="#FFFFFF" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 4 }} />
          <motion.circle cx="940" cy="115" r="1.6" fill="#60A5FA" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 4.2 }} />
          <motion.circle cx="980" cy="110" r="1.7" fill="#FFFFFF" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 4.4 }} />
          
          <motion.path
            d="M900,120 L940,115 L980,110"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.5 } }}
            transition={{ duration: 2, delay: 4.5 }}
          />
        </g>

        {/* Cassiopeia */}
        <g opacity="0.4">
          <motion.circle cx="1200" cy="60" r="1.5" fill="#A78BFA" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 5 }} />
          <motion.circle cx="1220" cy="80" r="1.3" fill="#FFFFFF" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 5.2 }} />
          <motion.circle cx="1240" cy="70" r="1.4" fill="#22D3EE" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 5.4 }} />
          <motion.circle cx="1260" cy="90" r="1.6" fill="#FFFFFF" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 5.6 }} />
          <motion.circle cx="1280" cy="65" r="1.5" fill="#F472B6" filter="url(#starGlow)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ delay: 5.8 }} />
          
          <motion.path
            d="M1200,60 L1220,80 L1240,70 L1260,90 L1280,65"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4 } }}
            transition={{ duration: 2.5, delay: 6 }}
          />
        </g>

        {/* Enhanced gradient and filter definitions */}
        <defs>
          {/* Star glow filter */}
          <filter id="starGlow" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Enhanced meteor glow filter */}
          <filter id="meteorGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Nebula gradients */}
          <radialGradient id="nebulaGradient1">
            <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0.2)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </radialGradient>
          
          <radialGradient id="nebulaGradient2">
            <stop offset="0%" stopColor="rgba(168,85,247,0.25)" />
            <stop offset="50%" stopColor="rgba(236,72,153,0.15)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </radialGradient>
        </defs>
      </motion.svg>

      {/* Enhanced SVG Animation for additional effects */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        transition={{ staggerChildren: 0.3 }}
      >
        {/* Galaxy Stars Background */}
        {/* Large bright stars */}
        <motion.circle
          cx="120" cy="60" r="1.5"
          fill="white"
          filter="url(#starGlow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.8, 1, 0.8], 
            scale: [1, 1.2, 1] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            delay: 0.5 
          }}
        />
        
        <motion.circle
          cx="890" cy="80" r="1.5"
          fill="#60A5FA"
          filter="url(#starGlow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.7, 1, 0.7], 
            scale: [1, 1.3, 1] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            delay: 1.2 
          }}
        />

        <motion.circle
          cx="1200" cy="120" r="1.5"
          fill="#A78BFA"
          filter="url(#starGlow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.6, 1, 0.6], 
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 3.5, 
            repeat: Infinity, 
            delay: 2 
          }}
        />

        {/* Medium stars */}
        <circle cx="250" cy="45" r="1" fill="white" opacity="0.7" />
        <circle cx="480" cy="95" r="1" fill="#22D3EE" opacity="0.6" />
        <circle cx="720" cy="140" r="1" fill="#818CF8" opacity="0.5" />
        <circle cx="1050" cy="70" r="1" fill="white" opacity="0.8" />
        <circle cx="1320" cy="160" r="1" fill="#F472B6" opacity="0.6" />
        <circle cx="300" cy="180" r="1" fill="#34D399" opacity="0.7" />

        {/* Small scattered stars */}
        <circle cx="80" cy="35" r="0.5" fill="white" opacity="0.5" />
        <circle cx="180" cy="75" r="0.5" fill="#60A5FA" opacity="0.4" />
        <circle cx="350" cy="55" r="0.5" fill="white" opacity="0.6" />
        <circle cx="420" cy="125" r="0.5" fill="#A78BFA" opacity="0.5" />
        <circle cx="580" cy="40" r="0.5" fill="#22D3EE" opacity="0.4" />
        <circle cx="650" cy="100" r="0.5" fill="white" opacity="0.5" />
        <circle cx="780" cy="170" r="0.5" fill="#F472B6" opacity="0.4" />
        <circle cx="920" cy="45" r="0.5" fill="white" opacity="0.6" />
        <circle cx="1100" cy="130" r="0.5" fill="#818CF8" opacity="0.5" />
        <circle cx="1250" cy="50" r="0.5" fill="#22D3EE" opacity="0.4" />
        <circle cx="1380" cy="90" r="0.5" fill="white" opacity="0.5" />
        <circle cx="150" cy="160" r="0.5" fill="#34D399" opacity="0.4" />
        <circle cx="450" cy="180" r="0.5" fill="white" opacity="0.5" />
        <circle cx="620" cy="200" r="0.5" fill="#A78BFA" opacity="0.4" />
        <circle cx="850" cy="190" r="0.5" fill="#F472B6" opacity="0.5" />

        {/* Tiny distant stars */}
        <circle cx="90" cy="90" r="0.3" fill="white" opacity="0.3" />
        <circle cx="210" cy="110" r="0.3" fill="#60A5FA" opacity="0.3" />
        <circle cx="380" cy="30" r="0.3" fill="white" opacity="0.4" />
        <circle cx="520" cy="80" r="0.3" fill="#A78BFA" opacity="0.3" />
        <circle cx="690" cy="60" r="0.3" fill="white" opacity="0.3" />
        <circle cx="820" cy="110" r="0.3" fill="#22D3EE" opacity="0.3" />
        <circle cx="970" cy="150" r="0.3" fill="white" opacity="0.4" />
        <circle cx="1150" cy="40" r="0.3" fill="#818CF8" opacity="0.3" />
        <circle cx="1300" cy="110" r="0.3" fill="white" opacity="0.3" />
        <circle cx="40" cy="140" r="0.3" fill="#34D399" opacity="0.3" />
        <circle cx="280" cy="200" r="0.3" fill="white" opacity="0.3" />
        <circle cx="550" cy="220" r="0.3" fill="#F472B6" opacity="0.3" />

        {/* Constellation lines - subtle connections */}
        <motion.line
          x1="120" y1="60" x2="250" y2="45"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, delay: 3 }}
        />
        
        <motion.line
          x1="890" y1="80" x2="1050" y2="70"
          stroke="rgba(96,165,250,0.1)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, delay: 3.5 }}
        />

        {/* Nebula-like gradient areas */}
        <motion.ellipse
          cx="400" cy="100" rx="80" ry="40"
          fill="url(#nebulaGradient1)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 4, delay: 2 }}
        />
        
        <motion.ellipse
          cx="1000" cy="150" rx="100" ry="50"
          fill="url(#nebulaGradient2)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 5, delay: 2.5 }}
        />

        {/* Enhanced gradient and filter definitions */}
        <defs>
          {/* Star glow filter */}
          <filter id="starGlow" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Enhanced meteor glow filter */}
          <filter id="meteorGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Nebula gradients */}
          <radialGradient id="nebulaGradient1">
            <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0.2)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </radialGradient>
          
          <radialGradient id="nebulaGradient2">
            <stop offset="0%" stopColor="rgba(168,85,247,0.25)" />
            <stop offset="50%" stopColor="rgba(236,72,153,0.15)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </radialGradient>
        </defs>
      </motion.svg>

      {/* Modern Stylistic Decorative Elements */}
      
      {/* Top accent line - positioned strategically */}
      <motion.div
        className="absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 via-cyan-300/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2.5, delay: 2.8, ease: "easeOut" }}
      />
      
      {/* Secondary accent line - offset for visual balance */}
      <motion.div
        className="absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-300/25 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 3.2, ease: "easeOut" }}
      />

      {/* Bottom section - modern layered approach */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/35 via-blue-200/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2.8, delay: 3.5, ease: "easeOut" }}
      />
      
      {/* Subtle bottom accent - asymmetric for modern feel */}
      <motion.div
        className="absolute bottom-4 left-1/3 right-1/6 h-px bg-gradient-to-r from-transparent via-purple-300/20 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2.2, delay: 4, ease: "easeOut" }}
      />

      {/* Meteor Shower - 15 Falling Stars with varied effects */}
      
      {/* Enhanced Meteors with Particle Trails */}
      
      {/* Fireball Meteor 1 - Blue */}
      <div className="absolute top-12 left-1/6" style={{ transform: 'rotate(120deg)' }}>
        <motion.div
          className="relative"
          initial={{ x: -200, y: -100, opacity: 0 }}
          animate={{ x: 300, y: 230, opacity: [0, 1, 0] }}
          transition={{ duration: 2.8, delay: 3.5, ease: "easeOut", repeat: Infinity, repeatDelay: 4 }}
        >
          {/* Main meteor body */}
          <div className="w-48 h-1.5 bg-gradient-to-r from-transparent via-blue-400 to-white shadow-xl"
               style={{ filter: 'drop-shadow(0 0 12px rgba(59,130,246,1)) drop-shadow(0 0 25px rgba(59,130,246,0.6))' }}>
          </div>
          
          {/* Particle trail */}
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-300 rounded-full"
              style={{
                left: `${-i * 6}px`,
                top: '2px',
                filter: 'blur(0.5px)',
              }}
              animate={{
                opacity: [0.8, 0.3, 0],
                scale: [1, 0.7, 0.3],
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 2.3,
              }}
            />
          ))}
          
          {/* Sparkle effects */}
          {Array.from({ length: 4 }, (_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                left: `${Math.random() * 20}px`,
                top: `${Math.random() * 4 - 2}px`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 0.3,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: 3.5,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Fireball Meteor 2 - Cyan */}
      <div className="absolute top-18 right-1/4" style={{ transform: 'rotate(120deg)' }}>
        <motion.div
          className="relative"
          initial={{ x: -180, y: -90, opacity: 0 }}
          animate={{ x: 280, y: 210, opacity: [0, 1, 0] }}
          transition={{ duration: 3.2, delay: 4.2, ease: "easeOut", repeat: Infinity, repeatDelay: 5 }}
        >
          {/* Main meteor body */}
          <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-white shadow-xl"
               style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,1)) drop-shadow(0 0 20px rgba(6,182,212,0.5))' }}>
          </div>
          
          {/* Particle trail */}
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-200 rounded-full"
              style={{
                left: `${-i * 7}px`,
                top: '2px',
                filter: 'blur(0.5px)',
              }}
              animate={{
                opacity: [0.7, 0.2, 0],
                scale: [1, 0.6, 0.2],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                repeat: Infinity,
                repeatDelay: 2.6,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Fireball Meteor 3 - Purple */}
      <div className="absolute top-8 left-1/2" style={{ transform: 'rotate(120deg)' }}>
        <motion.div
          className="relative"
          initial={{ x: -220, y: -110, opacity: 0 }}
          animate={{ x: 320, y: 250, opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, delay: 5.8, ease: "easeOut", repeat: Infinity, repeatDelay: 6 }}
        >
          {/* Main meteor body */}
          <div className="w-52 h-2 bg-gradient-to-r from-transparent via-indigo-400 to-white shadow-xl"
               style={{ filter: 'drop-shadow(0 0 15px rgba(99,102,241,1)) drop-shadow(0 0 30px rgba(99,102,241,0.4))' }}>
          </div>
          
          {/* Particle trail */}
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-indigo-300 rounded-full"
              style={{
                left: `${-i * 8}px`,
                top: '3px',
                filter: 'blur(0.5px)',
              }}
              animate={{
                opacity: [0.9, 0.4, 0],
                scale: [1.2, 0.8, 0.4],
              }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                repeat: Infinity,
                repeatDelay: 1.8,
              }}
            />
          ))}
          
          {/* Impact flash effect */}
          <motion.div
            className="absolute w-8 h-8 bg-white rounded-full"
            style={{
              right: '-15px',
              top: '-15px',
              filter: 'blur(4px)',
            }}
            animate={{
              opacity: [0, 0, 0.8, 0],
              scale: [0, 0, 2, 0],
            }}
            transition={{
              duration: 0.3,
              delay: 2.3,
              repeat: Infinity,
              repeatDelay: 6.2,
            }}
          />
        </motion.div>
      </div>

      {/* Medium meteors - Enhanced */}
      <motion.div
        className="absolute top-16 left-1/3 w-26 h-0.5 bg-gradient-to-r from-transparent via-purple-400/70 to-transparent origin-left"
        style={{ 
          transform: 'rotate(120deg)',
          filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.6))',
          background: 'linear-gradient(90deg, transparent, #A855F7, transparent)'
        }}
        initial={{ x: -100, y: -50, opacity: 0, scaleX: 0 }}
        animate={{ x: 150, y: 120, opacity: [0, 1, 0], scaleX: [0, 1, 0.6] }}
        transition={{ duration: 2.2, delay: 4.8, ease: "easeOut", repeat: Infinity, repeatDelay: 4.5 }}
      />

      <motion.div
        className="absolute top-22 right-1/3 w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-300/65 to-transparent origin-left"
        style={{ 
          transform: 'rotate(120deg)',
          filter: 'drop-shadow(0 0 3px rgba(236,72,153,0.5))',
          background: 'linear-gradient(90deg, transparent, #EC4899, transparent)'
        }}
        initial={{ x: -90, y: -45, opacity: 0, scaleX: 0 }}
        animate={{ x: 130, y: 110, opacity: [0, 1, 0], scaleX: [0, 1, 0.5] }}
        transition={{ duration: 2.6, delay: 3.2, ease: "easeOut", repeat: Infinity, repeatDelay: 4.2 }}
      />

      <motion.div
        className="absolute top-14 left-3/4 w-28 h-0.5 bg-gradient-to-r from-transparent via-teal-400/70 to-transparent origin-left"
        style={{ 
          transform: 'rotate(120deg)',
          filter: 'drop-shadow(0 0 5px rgba(20,184,166,0.6))',
          background: 'linear-gradient(90deg, transparent, #14B8A6, transparent)'
        }}
        initial={{ x: -110, y: -55, opacity: 0, scaleX: 0 }}
        animate={{ x: 160, y: 130, opacity: [0, 1, 0], scaleX: [0, 1, 0.7] }}
        transition={{ duration: 2.4, delay: 6.5, ease: "easeOut", repeat: Infinity, repeatDelay: 5.8 }}
      />

      {/* Small meteors for density */}
      <motion.div
        className="absolute top-10 left-1/5 w-16 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent origin-left"
        style={{ transform: 'rotate(120deg)' }}
        initial={{ x: -60, y: -30, opacity: 0, scaleX: 0 }}
        animate={{ x: 100, y: 80, opacity: [0, 1, 0], scaleX: [0, 1, 0.4] }}
        transition={{ duration: 1.8, delay: 4.5, ease: "easeOut", repeat: Infinity, repeatDelay: 4.2 }}
      />

      <motion.div
        className="absolute top-26 right-1/5 w-14 h-px bg-gradient-to-r from-transparent via-indigo-300/35 to-transparent origin-left"
        style={{ transform: 'rotate(120deg)' }}
        initial={{ x: -50, y: -25, opacity: 0, scaleX: 0 }}
        animate={{ x: 90, y: 70, opacity: [0, 1, 0], scaleX: [0, 1, 0.3] }}
        transition={{ duration: 2.0, delay: 5.5, ease: "easeOut", repeat: Infinity, repeatDelay: 5.8 }}
      />

      <motion.div
        className="absolute top-20 left-2/3 w-12 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent origin-left"
        style={{ transform: 'rotate(120deg)' }}
        initial={{ x: -40, y: -20, opacity: 0, scaleX: 0 }}
        animate={{ x: 80, y: 60, opacity: [0, 1, 0], scaleX: [0, 1, 0.3] }}
        transition={{ duration: 1.6, delay: 3.8, ease: "easeOut", repeat: Infinity, repeatDelay: 4.5 }}
      />

      {/* Tiny accent meteors */}
      <motion.div
        className="absolute top-6 right-1/6 w-10 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent origin-left"
        style={{ transform: 'rotate(120deg)' }}
        initial={{ x: -30, y: -15, opacity: 0, scaleX: 0 }}
        animate={{ x: 60, y: 50, opacity: [0, 1, 0], scaleX: [0, 1, 0.2] }}
        transition={{ duration: 1.4, delay: 6.2, ease: "easeOut", repeat: Infinity, repeatDelay: 3.8 }}
      />

      <motion.div
        className="absolute top-28 left-1/8 w-8 h-px bg-gradient-to-r from-transparent via-slate-300/20 to-transparent origin-left"
        style={{ transform: 'rotate(120deg)' }}
        initial={{ x: -25, y: -12, opacity: 0, scaleX: 0 }}
        animate={{ x: 50, y: 40, opacity: [0, 1, 0], scaleX: [0, 1, 0.2] }}
        transition={{ duration: 1.2, delay: 4.8, ease: "easeOut", repeat: Infinity, repeatDelay: 3.5 }}
      />

      <motion.div
        className="absolute top-24 right-1/8 w-10 h-px bg-gradient-to-r from-transparent via-purple-300/25 to-transparent origin-left"
        style={{ transform: 'rotate(120deg)' }}
        initial={{ x: -30, y: -15, opacity: 0, scaleX: 0 }}
        animate={{ x: 60, y: 50, opacity: [0, 1, 0], scaleX: [0, 1, 0.2] }}
        transition={{ duration: 1.5, delay: 7.2, ease: "easeOut", repeat: Infinity, repeatDelay: 4.2 }}
      />

      {/* Additional scattered meteors */}
      <motion.div
        className="absolute top-4 left-1/12 w-18 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent origin-left"
        style={{ transform: 'rotate(120deg)' }}
        initial={{ x: -70, y: -35, opacity: 0, scaleX: 0 }}
        animate={{ x: 110, y: 90, opacity: [0, 1, 0], scaleX: [0, 1, 0.5] }}
        transition={{ duration: 2.1, delay: 5.2, ease: "easeOut", repeat: Infinity, repeatDelay: 5.5 }}
      />

      <motion.div
        className="absolute top-30 right-1/12 w-16 h-px bg-gradient-to-r from-transparent via-orange-400/35 to-transparent origin-left"
        style={{ transform: 'rotate(120deg)' }}
        initial={{ x: -60, y: -30, opacity: 0, scaleX: 0 }}
        animate={{ x: 100, y: 80, opacity: [0, 1, 0], scaleX: [0, 1, 0.4] }}
        transition={{ duration: 1.9, delay: 6.8, ease: "easeOut", repeat: Infinity, repeatDelay: 4.8 }}
      />

      <motion.div
        className="absolute top-12 left-5/6 w-14 h-px bg-gradient-to-r from-transparent via-rose-400/30 to-transparent origin-left"
        style={{ transform: 'rotate(120deg)' }}
        initial={{ x: -50, y: -25, opacity: 0, scaleX: 0 }}
        animate={{ x: 90, y: 70, opacity: [0, 1, 0], scaleX: [0, 1, 0.3] }}
        transition={{ duration: 1.7, delay: 3.5, ease: "easeOut", repeat: Infinity, repeatDelay: 4.0 }}
      />

      {/* Animated particles for enhanced effect */}
      <motion.div
        className="absolute top-8 left-1/4 w-1 h-1 bg-blue-400 rounded-full"
        animate={{
          x: [0, 200, 400],
          y: [0, 100, 200],
          opacity: [0, 1, 0],
          scale: [0, 1, 0]
        }}
        transition={{
          duration: 3,
          delay: 4,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 6
        }}
      />

      <motion.div
        className="absolute top-16 right-1/4 w-1 h-1 bg-cyan-300 rounded-full"
        animate={{
          x: [-20, 180, 380],
          y: [0, 90, 180],
          opacity: [0, 1, 0],
          scale: [0, 1.2, 0]
        }}
        transition={{
          duration: 2.5,
          delay: 5.5,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 7
        }}
      />

      {/* Corner accent elements for modern touch */}
      <motion.div
        className="absolute top-4 right-8 w-12 h-px bg-gradient-to-r from-blue-400/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 4.2, ease: "easeOut" }}
      />
      
      <motion.div
        className="absolute bottom-3 left-12 w-16 h-px bg-gradient-to-r from-transparent to-slate-400/30"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 4.5, ease: "easeOut" }}
      />
    </div>
  );
}
