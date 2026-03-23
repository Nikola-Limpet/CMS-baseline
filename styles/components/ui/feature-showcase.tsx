"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  BookOpen, 
  Target, 
  Clock, 
  ChevronRight,
  BarChart3,
  Globe,
  Brain,
  Medal,
  Award,
  Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  {
    id: 'competitions',
    icon: Trophy,
    title: 'International Competitions',
    description: 'Join prestigious content competitions with students across Asia',
    image: '/SCIA-97.jpg',
    stats: ['30+ Competitions', '400+ Participants', '15+ Countries'],
    benefits: [
      'Certificates and awards for top performers',
      'Practice problems and preparation materials',
      'International recognition and rankings'
    ],
    cta: 'Join Next Competition',
    link: '/competitions',
    badge: 'Most Popular',
    color: 'bg-blue-600'
  },
  {
    id: 'courses',
    icon: BookOpen,
    title: 'Expert-Led Courses',
    description: 'Learn from award-winning instructors at our state-of-the-art centers',
    image: '/SCIA-101.jpg',
    stats: ['10+ Courses', '94% Success Rate', '24/7 Support'],
    benefits: [
      'Small class sizes for personalized attention',
      'Curriculum aligned with international standards',
      'Progress tracking and performance analytics',
      'Flexible scheduling and makeup classes'
    ],
    cta: 'Browse Courses',
    link: '/courses',
    badge: 'Premium Quality',
    color: 'bg-indigo-600'
  },
  {
    id: 'practice',
    icon: Target,
    title: 'Practice Problems',
    description: 'Master mathematical concepts with our extensive problem database',
    image: '/images/about/teaching.jpg',
    stats: ['20+ Problems', '20 Difficulty Levels', 'AI Hints'],
    benefits: [
      'Adaptive difficulty based on your progress',
      'Detailed solutions and explanations',
      'Topic-specific practice sets',
      'Performance analytics and insights'
    ],
    cta: 'Start Practicing',
    link: '/practice',
    badge: 'AI-Enhanced',
    color: 'bg-emerald-600'
  }
];

const achievements = [
  { icon: Medal, label: 'Gold Medalists', value: '200+' },
  { icon: Award, label: 'Awards', value: '100+' },
  { icon: Globe, label: 'Partners', value: '10+' },
  { icon: Users, label: 'Students', value: '1000+' },
];

export default function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const [, setHoveredFeature] = useState<string | null>(null);

  const currentFeature = features.find(f => f.id === activeFeature) || features[0];
  
  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge 
            variant="outline"
            className="mb-4 bg-blue-50 text-blue-700 border-blue-200 px-4 py-1.5 text-sm font-medium rounded-full"
          >
            <Brain className="w-4 h-4 mr-2" />
            Platform Features
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Everything You Need to <span className="text-blue-600">Excel</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our comprehensive platform combines expert instruction, competitive challenges, 
            and adaptive learning.
          </p>
        </motion.div>

        {/* Feature Tabs and Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
          {/* Left Column - Feature Navigation */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Choose Your Path</h3>
            
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 border shadow-none ${
                    activeFeature === feature.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-md'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setActiveFeature(feature.id)}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <CardHeader className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${feature.color} text-white shadow-sm`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <CardTitle className="text-lg font-bold text-slate-900">{feature.title}</CardTitle>
                          {feature.badge && (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider font-bold">
                              {feature.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm text-slate-600">
                          {feature.description}
                        </CardDescription>
                      </div>
                      <ChevronRight className={cn(
                        "h-5 w-5 transition-transform",
                        activeFeature === feature.id ? "text-blue-500 rotate-90" : "text-slate-300"
                      )} />
                    </div>
                  </CardHeader>
                
                  {activeFeature === feature.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="px-6 pb-6 pt-0">
                        <div className="space-y-6">
                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-3">
                            {feature.stats.map((stat, statIndex) => (
                              <div key={statIndex} className="text-center p-3 bg-white border border-slate-100 rounded-lg">
                                <div className="text-[11px] font-bold text-slate-900">{stat}</div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Benefits List */}
                          <div className="space-y-2">
                            {feature.benefits.map((benefit, benefitIndex) => (
                              <div key={benefitIndex} className="flex items-start space-x-2 text-sm text-slate-600">
                                <span className={`w-1.5 h-1.5 rounded-full ${feature.color} mt-1.5 flex-shrink-0`} />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                          
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg" asChild>
                            <Link href={feature.link}>
                              {feature.cta}
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Visual */}
          <div className="relative lg:pt-10">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <Image
                src={currentFeature.image}
                alt={currentFeature.title}
                fill
                className="object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${currentFeature.color}`}>
                    <currentFeature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold">{currentFeature.title}</h4>
                </div>
                <p className="text-sm text-white/90 mb-6 max-w-sm">{currentFeature.description}</p>
                
                <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
                  <Link href={currentFeature.link}>
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-slate-100">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                <div>
                  <div className="text-sm font-bold text-slate-900">94% Success</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Student Growth</div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/4 -left-6 bg-white rounded-lg shadow-lg p-4 border border-slate-100">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-bold text-slate-900">24/7 Access</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Learn Anytime</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="pt-20 border-t border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                  <achievement.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-slate-900 mb-1">{achievement.value}</div>
                  <div className="text-sm text-slate-500 font-medium">{achievement.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 