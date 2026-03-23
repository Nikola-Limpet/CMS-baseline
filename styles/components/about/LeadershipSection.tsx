'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Award, Users, TrendingUp, Calendar } from 'lucide-react';

interface Leader {
  id: number;
  name: string;
  position: string;
  bio: string;
  achievements: string[];
  experience: string;
  image: string;
  specialties: string[];
  education?: string;
}

const leaders: Leader[] = [
  {
    id: 1,
    name: 'Mr. Samrong Chansok',
    position: 'MOVE Manager',
    bio: 'A dedicated mathematics educator with over 10 years of experience in teaching and curriculum development. Mr. Chansok has been instrumental in developing innovative teaching methodologies that have helped hundreds of students excel in mathematics competitions and academic pursuits. His passion for mathematics education and commitment to student success drives MOVE\'s mission to provide world-class mathematical training.',
    achievements: [
      'Led mathematics programs that produced 50+ competition winners',
      'Developed innovative teaching methodologies for competition preparation',
      'Trained over 300 students in advanced mathematics concepts',
      'Established partnerships with international mathematics organizations',
      'Pioneered online competition platforms for Asia-wide participation'
    ],
    experience: '10+ years in Mathematics Education',
    image: '/images/about/kru-somrong.jpg',
    specialties: [
      'Competition Mathematics',
      'Curriculum Development',
      'Student Mentorship',
      'Educational Technology',
      'International Competitions'
    ],
    education: 'Mathematics Education, Specialized in Competition Training'
  }
];

const stats = [
  { icon: Users, label: 'Students Trained', value: '300+' },
  { icon: Award, label: 'Competition Winners', value: '500+' },
  { icon: TrendingUp, label: 'Success Rate', value: '94%' },
  { icon: Calendar, label: 'Years Experience', value: '10+' }
];

export default function LeadershipSection() {
  const [expandedLeader, setExpandedLeader] = useState<number | null>(null);

  const toggleExpanded = (leaderId: number) => {
    setExpandedLeader(expandedLeader === leaderId ? null : leaderId);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-navy mb-6"
          >
            Meet Our Leadership
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Our experienced leadership team is dedicated to providing exceptional mathematics education 
            and fostering academic excellence through innovative teaching methods.
          </motion.p>
        </div>

        {/* Statistics Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border border-teal-100">
                <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-teal-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-navy mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Leadership Profiles */}
        <div className="max-w-4xl mx-auto">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
            >
              {/* Leader Header */}
              <div className="p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Profile Image */}
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-teal-100 shadow-lg">
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Leader Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl lg:text-3xl font-bold text-navy mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-lg text-teal-600 font-semibold mb-4">
                      {leader.position}
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {leader.experience}
                      </span>
                      {leader.education && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                          {leader.education}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {leader.bio}
                    </p>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleExpanded(leader.id)}
                      className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-200"
                    >
                      {expandedLeader === leader.id ? 'Show Less' : 'Learn More'}
                      {expandedLeader === leader.id ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedLeader === leader.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 pt-8 border-t border-gray-200"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Specialties */}
                      <div>
                        <h4 className="text-lg font-semibold text-navy mb-4 flex items-center">
                          <TrendingUp className="h-5 w-5 text-teal-600 mr-2" />
                          Areas of Expertise
                        </h4>
                        <div className="space-y-2">
                          {leader.specialties.map((specialty, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                              <span className="text-gray-700">{specialty}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h4 className="text-lg font-semibold text-navy mb-4 flex items-center">
                          <Award className="h-5 w-5 text-teal-600 mr-2" />
                          Key Achievements
                        </h4>
                        <div className="space-y-3">
                          {leader.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm leading-relaxed">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-100">
            <h3 className="text-2xl font-bold text-navy mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our olympiad programs and learn from experienced educators dedicated to your success. 
              Experience the MOVE difference with personalized instruction and proven results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                View Our Courses
              </Link>
              <Link
                href="/competitions"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-600 hover:text-white transition-colors duration-200"
              >
                Join Competitions
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
