import React from 'react';
import { Lightbulb, Target, BookOpen } from 'lucide-react';
import AnimatedDecorativeLine from '@/components/feature/AnimatedDecorativeLine';

const MissionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Our Mission & Vision
          </h2>
          
          <div className="flex justify-center mb-6">
            <AnimatedDecorativeLine width="w-24" height="h-1.5" color="from-teal-500 to-navy" />
          </div>
          
          <p className="text-lg text-gray-600">
            MOVE is dedicated to transforming educational experiences through innovative approaches, 
            fostering global partnerships, and empowering students to reach their full potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-6">
              <Lightbulb className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-4">Our Mission</h3>
            <p className="text-gray-600 mb-4">
              To provide accessible, high-quality education that prepares students for success in a rapidly changing global environment through innovative teaching methods and personalized learning experiences.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 mr-2"></span>
                <span>Delivering excellence in education</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 mr-2"></span>
                <span>Fostering a culture of innovation</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 mr-2"></span>
                <span>Building global partnerships</span>
              </li>
            </ul>
          </div>
          
          {/* Vision */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-4">Our Vision</h3>
            <p className="text-gray-600 mb-4">
              To be recognized globally as a leading institution that transforms lives through education, empowering individuals to contribute meaningfully to society and address the challenges of tomorrow.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                <span>Global recognition for excellence</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                <span>Transformative educational impact</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                <span>Preparing future leaders</span>
              </li>
            </ul>
          </div>
          
          {/* Values */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-4">Our Values</h3>
            <p className="text-gray-600 mb-4">
              We are guided by a commitment to excellence, integrity, diversity, and innovation in everything we do, creating an inclusive environment where every student can thrive.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2"></span>
                <span>Excellence in all endeavors</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2"></span>
                <span>Integrity and ethical conduct</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2"></span>
                <span>Diversity and inclusion</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
