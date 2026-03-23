"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const flags = [
  { name: 'Cambodia', src: '/flags/Cambodia.png' },
  { name: 'Indonesia', src: '/flags/Indon.png' },
  { name: 'Vietnam', src: '/flags/vietnam.svg' },
  // { name: 'Thailand', src: '/flags/thai.svg' },
  { name: 'China', src: '/flags/china.png' },
  { name: 'Singapore', src: '/flags/singapo.png' },
  { name: 'Myanmar', src: '/flags/myanmar.png' },
  { name: 'Laos', src: '/flags/laos.png' },
  { name: 'Hong Kong', src: '/flags/Hong_Kong.png' },
  { name: 'Malaysia', src: '/flags/Malaysia.png' },
  { name: 'Turkey', src: '/flags/turkey.png' },
  { name: 'Saudi Arabia', src: '/flags/Saudi_Arabia.png' },
  { name: 'Philippines', src: '/flags/phil.svg' },
];

const PartnerCountries = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-teal-50 via-sky-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative curves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // Trigger animation sooner
          transition={{ staggerChildren: 0.3 }} // Stagger children animations
        >
          {/* Path 1: Teal, thicker, base wave */}
          <motion.path
            d="M-200 250 C 300 100, 500 400, 800 200 C 1100 0, 1300 300, 1500 150"
            stroke="rgb(20 184 166 / 0.15)" // Teal, slightly less opaque
            strokeWidth="4"
            fill="none"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { 
                pathLength: 1, 
                opacity: 1, 
                transition: { duration: 2.5, ease: [0.42, 0, 0.58, 1] } 
              }
            }}
          />
          {/* Path 2: Blue, medium, counter-wave */}
          <motion.path
            d="M-150 550 C 250 700, 550 450, 850 600 C 1150 750, 1250 500, 1550 400"
            stroke="rgb(59 130 246 / 0.1)" // Blue, less opaque
            strokeWidth="3"
            fill="none"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { 
                pathLength: 1, 
                opacity: 1, 
                transition: { duration: 3, ease: [0.42, 0, 0.58, 1], delay: 0.3 } 
              }
            }}
          />
          {/* Path 3: Lighter Sky Blue/Teal, thinner, accent detail */}
          <motion.path
            d="M100 -50 C 400 150, 700 -100, 1000 200 C 1300 500, 1000 600, 700 450"
            stroke="rgb(14 165 233 / 0.2)" // Sky blue, slightly more opaque for accent
            strokeWidth="2.5"
            fill="none"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { 
                pathLength: 1, 
                opacity: 1, 
                transition: { duration: 2.2, ease: [0.42, 0, 0.58, 1], delay: 0.6 } 
              }
            }}
          />
        </motion.svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4 md:mb-6"
          >
            Connecting Minds Across Asia
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            MOVE proudly collaborates with institutions and students from diverse nations, fostering a vibrant community of learners and innovators throughout the Asian continent.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-1 md:gap-8 max-w-4xl mx-auto mb-10 md:mb-16"
        >
          {flags.map((flag) => (
            <motion.div
              key={flag.name}
              variants={itemVariants}
              className="p-1 md:p-1 rounded-xl flex flex-col items-center justify-center aspect-[3/2]"
            >
              <div className="relative w-20 h-20 md:w-20 md:h-20 mb-0.5 md:mb-1">
                <Image
                  src={flag.src}
                  alt={`${flag.name} flag`}
                  fill
                  className="object-contain"
                  unoptimized // If SVGs are simple and don't need Next.js optimization
                />
              </div>
              <p className="text-lg font-serif md:text-xl font-medium text-gray-700 text-center">{flag.name}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* <motion.div variants={itemVariants} className="text-center">
          <Button 
            variant="default" // Use your primary button style
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => console.log('Explore partnerships clicked')}
          >
            Explore Our Partnerships
          </Button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default PartnerCountries;
