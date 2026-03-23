"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  size: number;
  duration: number;
  delay: number;
}

const mathSymbols = ['∑', '∫', 'π', '∞', '√', 'θ', 'φ', 'Δ', 'λ', 'μ', '∂', '∇'];

export default function MathParticleBackground({ className = '' }: { className?: string }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Generate random particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
        size: Math.random() * 20 + 15,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 5,
      });
    }
    setParticles(newParticles);
  }, []);

  if (!isClient) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-white/40 font-mono select-none pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {particle.symbol}
        </motion.div>
      ))}
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
    </div>
  );
}