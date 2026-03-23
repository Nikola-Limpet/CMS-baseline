import React from 'react';
import AnimatedDecorativeLine from '@/components/feature/AnimatedDecorativeLine';

const AboutHero = () => {
  return (
    <section className="relative  text-white py-24 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/patterns/noise.png')] opacity-5"></div>
        
        {/* Subtle animated elements */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent"></div>
          <div className="absolute top-[80%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent"></div>
        </div>
        
        {/* Animated Gradient Blob */}
        <div className="absolute -right-48 -bottom-48 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -left-48 -bottom-48 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About MOVE</h1>
          
          <div className="flex justify-center mb-8">
            <AnimatedDecorativeLine width="w-32" height="h-1.5" color="from-white to-teal-300" />
          </div>
          
          <p className="text-xl text-white/90 mb-8">
            Transforming lives through innovative education and global partnerships since 2018
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 min-w-[120px]">
              <span className="text-3xl font-bold">7+</span>
              <span className="text-white/80 text-sm">Years</span>
            </div>
            
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 min-w-[120px]">
              <span className="text-3xl font-bold">50k+</span>
              <span className="text-white/80 text-sm">Students</span>
            </div>
            
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 min-w-[120px]">
              <span className="text-3xl font-bold">120+</span>
              <span className="text-white/80 text-sm">Partners</span>
            </div>
            
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 min-w-[120px]">
              <span className="text-3xl font-bold">12+</span>
              <span className="text-white/80 text-sm">Countries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
