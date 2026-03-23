"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight, Lock, CheckCircle } from 'lucide-react';

interface JourneyStep {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed?: boolean;
  locked?: boolean;
}

const journeySteps: JourneyStep[] = [
  {
    id: 'arithmetic',
    title: 'Arithmetic',
    subtitle: 'Foundation of Mathematics',
    icon: '➕',
    color: 'from-green-400 to-green-600',
    description: 'Master basic operations, fractions, and number theory',
    difficulty: 'Beginner',
    completed: true,
  },
  {
    id: 'algebra',
    title: 'Algebra',
    subtitle: 'Language of Patterns',
    icon: '𝑥²',
    color: 'from-blue-400 to-blue-600',
    description: 'Explore equations, functions, and abstract thinking',
    difficulty: 'Beginner',
    completed: true,
  },
  {
    id: 'geometry',
    title: 'Geometry',
    subtitle: 'Shapes & Space',
    icon: '△',
    color: 'from-purple-400 to-purple-600',
    description: 'Understand shapes, angles, and spatial relationships',
    difficulty: 'Intermediate',
    completed: false,
  },
  {
    id: 'trigonometry',
    title: 'Trigonometry',
    subtitle: 'Angles & Waves',
    icon: 'sin',
    color: 'from-indigo-400 to-indigo-600',
    description: 'Master triangles, periodic functions, and identities',
    difficulty: 'Intermediate',
    completed: false,
  },
  {
    id: 'calculus',
    title: 'Calculus',
    subtitle: 'Change & Motion',
    icon: '∫',
    color: 'from-pink-400 to-pink-600',
    description: 'Dive into derivatives, integrals, and limits',
    difficulty: 'Advanced',
    completed: false,
    locked: true,
  },
  {
    id: 'statistics',
    title: 'Statistics',
    subtitle: 'Data & Probability',
    icon: '📊',
    color: 'from-orange-400 to-orange-600',
    description: 'Analyze data, probability, and make predictions',
    difficulty: 'Advanced',
    completed: false,
    locked: true,
  },
];

export default function MathJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({
    container: containerRef,
  });

  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [, setSelectedStep] = useState<string | null>(null);

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Your Mathematical Journey
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Progress through increasingly challenging topics and unlock your mathematical potential
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-500 to-blue-500"
            initial={{ width: 0 }}
            whileInView={{ width: '33%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">2 of 6 topics completed</p>
      </div>

      {/* Journey Timeline */}
      <div 
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide pb-4"
      >
        <div className="flex gap-6 min-w-max px-4">
          {journeySteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection Line */}
              {index < journeySteps.length - 1 && (
                <div className="absolute top-20 left-full w-6 h-0.5 bg-gray-300 z-0" />
              )}
              
              {/* Step Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredStep(step.id)}
                onHoverEnd={() => setHoveredStep(null)}
                onClick={() => !step.locked && setSelectedStep(step.id)}
                className={`
                  relative w-64 p-6 rounded-2xl cursor-pointer
                  ${step.locked ? 'opacity-50' : ''}
                  ${step.completed ? 'ring-2 ring-green-500' : ''}
                  bg-white shadow-lg hover:shadow-xl transition-all
                `}
              >
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-2xl
                  bg-gradient-to-br ${step.color} text-white mb-4
                  ${step.locked ? 'grayscale' : ''}
                `}>
                  {step.locked ? <Lock size={24} /> : step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{step.subtitle}</p>
                
                {/* Difficulty Badge */}
                <span className={`
                  inline-block px-3 py-1 rounded-full text-xs font-medium mb-3
                  ${step.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : ''}
                  ${step.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${step.difficulty === 'Advanced' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {step.difficulty}
                </span>

                {/* Description (show on hover) */}
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: hoveredStep === step.id ? 1 : 0,
                    height: hoveredStep === step.id ? 'auto' : 0
                  }}
                  className="text-sm text-gray-600 overflow-hidden"
                >
                  {step.description}
                </motion.p>

                {/* Status Indicator */}
                {step.completed && (
                  <CheckCircle className="absolute top-4 right-4 text-green-500" size={24} />
                )}

                {/* CTA */}
                {!step.locked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredStep === step.id ? 1 : 0 }}
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600"
                  >
                    {step.completed ? 'Review' : 'Start Learning'}
                    <ArrowRight size={16} />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}