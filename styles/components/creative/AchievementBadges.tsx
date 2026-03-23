"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Star, Zap, Target } from 'lucide-react';

interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'gold' | 'silver' | 'bronze' | 'special';
  icon: React.ReactNode;
  year?: string;
  competition?: string;
  count?: number;
}

const badges: Badge[] = [
  {
    id: 'imo-gold',
    title: 'IMO Gold Medal',
    description: 'International Mathematical Olympiad Champion',
    category: 'gold',
    icon: <Trophy className="w-8 h-8" />,
    year: '2024',
    competition: 'IMO',
    count: 3,
  },
  {
    id: 'apmo-gold',
    title: 'APMO Gold',
    description: 'Asia Pacific Mathematics Olympiad',
    category: 'gold',
    icon: <Medal className="w-8 h-8" />,
    year: '2024',
    competition: 'APMO',
    count: 5,
  },
  {
    id: 'national-silver',
    title: 'National Silver',
    description: 'National Mathematics Competition',
    category: 'silver',
    icon: <Award className="w-8 h-8" />,
    year: '2024',
    competition: 'National',
    count: 12,
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Achieved 100% in competition',
    category: 'special',
    icon: <Star className="w-8 h-8" />,
    count: 8,
  },
  {
    id: 'speed-solver',
    title: 'Speed Solver',
    description: 'Fastest problem solver award',
    category: 'special',
    icon: <Zap className="w-8 h-8" />,
    count: 15,
  },
  {
    id: 'bronze-medals',
    title: 'Bronze Excellence',
    description: 'Regional competition achievements',
    category: 'bronze',
    icon: <Target className="w-8 h-8" />,
    year: '2023-2024',
    count: 25,
  },
];

const categoryColors = {
  gold: 'from-yellow-400 to-amber-600',
  silver: 'from-gray-300 to-gray-500',
  bronze: 'from-orange-400 to-orange-600',
  special: 'from-purple-400 to-pink-600',
};

const categoryGlow = {
  gold: 'shadow-yellow-400/50',
  silver: 'shadow-gray-400/50',
  bronze: 'shadow-orange-400/50',
  special: 'shadow-purple-400/50',
};

export default function AchievementBadges() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [flippedBadges, setFlippedBadges] = useState<Set<string>>(new Set());

  const categories = ['all', 'gold', 'silver', 'bronze', 'special'];
  
  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const toggleFlip = (badgeId: string) => {
    setFlippedBadges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(badgeId)) {
        newSet.delete(badgeId);
      } else {
        newSet.add(badgeId);
      }
      return newSet;
    });
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
          Student Achievements Gallery
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Celebrating excellence in mathematical competitions worldwide
        </motion.p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-6 py-2 rounded-full font-medium transition-all
              ${selectedCategory === category 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Badges Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onHoverStart={() => setHoveredBadge(badge.id)}
              onHoverEnd={() => setHoveredBadge(null)}
              onClick={() => toggleFlip(badge.id)}
              className="relative h-64 cursor-pointer preserve-3d"
              style={{
                transformStyle: 'preserve-3d',
                transform: flippedBadges.has(badge.id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s',
              }}
            >
              {/* Front Side */}
              <div className={`
                absolute inset-0 rounded-2xl p-6
                bg-white shadow-lg hover:shadow-2xl
                transition-all duration-300
                ${hoveredBadge === badge.id ? `shadow-2xl ${categoryGlow[badge.category]}` : ''}
                backface-hidden
              `}>
                {/* Badge Icon */}
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center mb-4
                  bg-gradient-to-br ${categoryColors[badge.category]} text-white
                  ${hoveredBadge === badge.id ? 'animate-pulse' : ''}
                `}>
                  {badge.icon}
                </div>

                {/* Badge Info */}
                <h3 className="text-xl font-bold mb-2">{badge.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{badge.description}</p>

                {/* Metadata */}
                <div className="space-y-2 text-sm">
                  {badge.year && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Year:</span>
                      <span className="font-medium">{badge.year}</span>
                    </div>
                  )}
                  {badge.competition && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Competition:</span>
                      <span className="font-medium">{badge.competition}</span>
                    </div>
                  )}
                </div>

                {/* Count Badge */}
                {badge.count && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {badge.count} Winners
                    </div>
                  </div>
                )}

                {/* Hover Effect Particles */}
                {hoveredBadge === badge.id && badge.category === 'gold' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        style={{
                          left: `${20 + i * 12}%`,
                          bottom: '20%',
                        }}
                        animate={{
                          y: [-20, -60, -20],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Back Side */}
              <div className={`
                absolute inset-0 rounded-2xl p-6
                bg-gradient-to-br ${categoryColors[badge.category]} text-white
                shadow-lg backface-hidden rotate-y-180
              `}>
                <h3 className="text-2xl font-bold mb-4">Details</h3>
                <div className="space-y-3">
                  <p className="text-sm opacity-90">
                    This achievement represents outstanding performance in mathematical problem-solving.
                  </p>
                  <div className="pt-4 border-t border-white/30">
                    <p className="text-xs opacity-75">Click to flip back</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}