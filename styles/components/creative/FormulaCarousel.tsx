"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Pause, Play } from 'lucide-react';
import KatexRenderer from '@/components/common/KatexRenderer';

interface Formula {
  id: string;
  name: string;
  formula: string;
  category: 'physics' | 'pure-math' | 'applied-math';
  description: string;
  applications: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

const formulas: Formula[] = [
  {
    id: 'pythagorean',
    name: 'Pythagorean Theorem',
    formula: 'a^2 + b^2 = c^2',
    category: 'pure-math',
    description: 'Fundamental relationship in Euclidean geometry among the three sides of a right triangle',
    applications: ['Distance calculations', 'Navigation', 'Construction'],
    difficulty: 'basic',
  },
  {
    id: 'quadratic',
    name: 'Quadratic Formula',
    formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    category: 'pure-math',
    description: 'Solution to the general quadratic equation ax² + bx + c = 0',
    applications: ['Physics problems', 'Economics', 'Engineering'],
    difficulty: 'basic',
  },
  {
    id: 'euler',
    name: "Euler's Identity",
    formula: 'e^{i\\pi} + 1 = 0',
    category: 'pure-math',
    description: 'Called "the most beautiful equation in mathematics", linking five fundamental constants',
    applications: ['Complex analysis', 'Quantum physics', 'Signal processing'],
    difficulty: 'advanced',
  },
  {
    id: 'newton-motion',
    name: "Newton's Second Law",
    formula: 'F = ma',
    category: 'physics',
    description: 'The acceleration of an object is directly proportional to the net force',
    applications: ['Mechanics', 'Rocket science', 'Vehicle dynamics'],
    difficulty: 'basic',
  },
  {
    id: 'schrodinger',
    name: 'Schrödinger Equation',
    formula: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi',
    category: 'physics',
    description: 'Fundamental equation of quantum mechanics',
    applications: ['Quantum computing', 'Chemistry', 'Material science'],
    difficulty: 'advanced',
  },
  {
    id: 'gaussian',
    name: 'Gaussian Distribution',
    formula: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}',
    category: 'applied-math',
    description: 'The normal distribution, fundamental in statistics and probability',
    applications: ['Data analysis', 'Machine learning', 'Quality control'],
    difficulty: 'intermediate',
  },
];

const categoryColors = {
  'physics': 'from-blue-500 to-indigo-600',
  'pure-math': 'from-purple-500 to-pink-600',
  'applied-math': 'from-green-500 to-teal-600',
};

export default function FormulaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [expandedFormula, setExpandedFormula] = useState<string | null>(null);

  const currentFormula = formulas[currentIndex];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % formulas.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + formulas.length) % formulas.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % formulas.length);
  };

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Famous Mathematical Formulas
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Explore the equations that changed the world
        </motion.p>
      </div>

      {/* Main Carousel */}
      <div className="relative max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFormula.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="p-8 md:p-12"
            >
              {/* Category Badge */}
              <div className="flex justify-between items-start mb-6">
                <span className={`
                  inline-block px-4 py-2 rounded-full text-white text-sm font-medium
                  bg-gradient-to-r ${categoryColors[currentFormula.category]}
                `}>
                  {currentFormula.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                
                {/* Difficulty Indicator */}
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`
                        w-2 h-2 rounded-full
                        ${level <= (currentFormula.difficulty === 'basic' ? 1 : currentFormula.difficulty === 'intermediate' ? 2 : 3)
                          ? 'bg-yellow-400' : 'bg-gray-300'}
                      `}
                    />
                  ))}
                </div>
              </div>

              {/* Formula Name */}
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                {currentFormula.name}
              </h3>

              {/* Formula Display */}
              <div 
                className="text-center py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-8 cursor-pointer"
                onClick={() => setExpandedFormula(expandedFormula === currentFormula.id ? null : currentFormula.id)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-3xl md:text-4xl"
                >
                  <KatexRenderer textWithMath={currentFormula.formula} />
                </motion.div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {currentFormula.description}
              </p>

              {/* Applications */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Info size={18} />
                  Applications:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentFormula.applications.map((app, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {app}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronRight size={24} />
        </button>

        {/* Auto-play Control */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {formulas.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all
              ${index === currentIndex 
                ? 'w-8 bg-blue-600' 
                : 'bg-gray-300 hover:bg-gray-400'}
            `}
          />
        ))}
      </div>

      {/* Formula Gallery (Optional Preview) */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {formulas.map((formula, index) => (
          <motion.div
            key={formula.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentIndex(index)}
            className={`
              p-4 rounded-lg cursor-pointer text-center
              ${index === currentIndex 
                ? 'bg-blue-100 ring-2 ring-blue-500' 
                : 'bg-gray-100 hover:bg-gray-200'}
            `}
          >
            <div className="text-sm font-medium mb-2">{formula.name}</div>
            <div className="text-xs opacity-75">
              <KatexRenderer textWithMath={formula.formula} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}