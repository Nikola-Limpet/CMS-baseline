"use client";

import React from 'react';
import { motion } from 'framer-motion';

const FloatingMathSymbols = ({ className = '' }: { className?: string }) => {
  const symbols = [
    { symbol: '∑', delay: 0, duration: 25 },
    { symbol: '∫', delay: 2, duration: 30 },
    { symbol: 'π', delay: 4, duration: 28 },
    { symbol: '∞', delay: 6, duration: 32 },
    { symbol: '√', delay: 8, duration: 26 },
    { symbol: 'θ', delay: 10, duration: 29 },
    { symbol: 'φ', delay: 12, duration: 31 },
    { symbol: 'Δ', delay: 14, duration: 27 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="relative w-full h-full">
        {symbols.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl md:text-6xl font-light"
            style={{
              left: `${10 + (index * 12)}%`,
              top: '100%',
            }}
            animate={{
              y: '-120vh',
              x: [0, 30, -20, 40, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.3, 0.5, 0.3, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <span className="text-white/30 blur-[0.5px]">{item.symbol}</span>
          </motion.div>
        ))}
        
        {/* Additional layer with different timing */}
        {symbols.map((item, index) => (
          <motion.div
            key={`layer2-${index}`}
            className="absolute text-3xl md:text-5xl font-light"
            style={{
              left: `${5 + (index * 13)}%`,
              top: '100%',
            }}
            animate={{
              y: '-120vh',
              x: [-20, 40, -30, 20, -10],
              rotate: [360, 180, 0],
              opacity: [0, 0.2, 0.4, 0.2, 0],
            }}
            transition={{
              duration: item.duration + 5,
              delay: item.delay + 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <span className="text-blue-300/20 blur-[1px]">{item.symbol}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none" />
    </div>
  );
};

export default FloatingMathSymbols;