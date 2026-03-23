"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Trophy, 
  BookOpen,
  ChevronRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { IconBrandTelegram } from '@tabler/icons-react';

const ctaSections = [
  {
    id: 'join-competition',
    title: 'Ready to Compete?',
    subtitle: 'Join Our Next International Math Competition',
    description: 'Challenge yourself against the brightest minds in Asia. Registration closes in 15 days!',
    image: '/SCIA-46.jpg',
    primaryCta: 'Register Now',
    primaryLink: 'https://t.me/CMSCambodia',
    secondaryCta: 'View Schedule',
    secondaryLink: 'https://t.me/CMSCambodia',
    badge: 'Next Competition: Dec 15',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-600',
    stats: ['500+ Participants', '15 Countries', '$10K Prize Pool']
  },
  {
    id: 'start-learning',
    title: 'Begin Your Journey',
    subtitle: 'Enroll in Expert-Led Mathematics Courses',
    description: 'Learn from award-winning instructors at our state-of-the-art centers. Small class sizes guaranteed.',
    image: '/SCIA-101.jpg',
    primaryCta: 'Browse Courses',
    primaryLink: '/courses',
    secondaryCta: 'Book Trial Class',
    secondaryLink: 'https://t.me/CMSCambodia',
    badge: 'Free Trial Available',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    stats: ['50+ Courses', '94% Success Rate', 'Expert Instructors']
  },
  {
    id: 'newsletter',
    title: 'Stay Connected',
    subtitle: 'Join Our Mathematical Community',
    description: 'Get weekly math challenges, competition updates, and expert tips delivered to your inbox.',
    image: '/SCIA-145.jpg',
    primaryCta: 'Subscribe Now',
    primaryLink: 'https://t.me/CMSCambodia',
    secondaryCta: 'View Sample',
    secondaryLink: 'https://t.me/CMSCambodia',
    badge: '3K+ Subscribers',
    icon: Mail,
    color: 'from-green-500 to-teal-600',
    stats: ['Weekly Updates', 'Expert Tips', 'Exclusive Content']
  }
];

const contactInfo = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+096 446 5954',
    displayValue: '+096 446 5954',
    subtext: 'Mon-Fri 9AM-6PM SGT',
    href: 'tel:+0964465954'
  },
  {
    icon: IconBrandTelegram,
    label: 'Contact Us',
    value: 'https://t.me/CMSCambodia',
    displayValue: 'CMSCambodia',
    subtext: 'Response within 24 hours',
    href: 'https://t.me/CMSCambodia'
  },
  {
    icon: MapPin,
    label: 'Visit Us',
    value: 'At CMS Center',
    displayValue: 'Phnom Penh Center',
    subtext: 'Official Center Location',
    href: 'https://maps.app.goo.gl/wxdeyVK2SLyDr3Ub9?g_st=ic'
  }
];

export default function StrategicCtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-2">
            Take Action
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your
            <span className="block text-blue-300">Mathematical Journey?</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Choose your path to mathematical excellence. Whether you want to compete, 
            learn, or stay connected, we have the perfect option for you.
          </p>
        </div>

        {/* CTA Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {ctaSections.map((cta, _index) => (
            <div
              key={cta.id}
              className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                <Image
                  src={cta.image}
                  alt={cta.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Badge and Icon */}
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 text-xs"
                  >
                    {cta.badge}
                  </Badge>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${cta.color}`}>
                    <cta.icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Title and Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{cta.title}</h3>
                  <h4 className="text-lg text-blue-200 mb-3">{cta.subtitle}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{cta.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {cta.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center p-2 bg-white/10 rounded-lg">
                      <div className="text-xs font-semibold text-white">{stat}</div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href={cta.primaryLink} className="block">
                    <Button
                      className={`w-full bg-gradient-to-r ${cta.color} text-white hover:opacity-90 group/btn`}
                    >
                      {cta.primaryCta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href={cta.secondaryLink} className="block">
                    <Button
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10 group/btn"
                    >
                      {cta.secondaryCta}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Need Help Getting Started?</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactInfo.map((contact, index) => (
              <div key={index} className="group">
                <Link 
                  href={contact.href}
                  target={contact.label === 'Visit Us' || contact.label === 'Contact Us' ? '_blank' : undefined}
                  rel={contact.label === 'Visit Us' || contact.label === 'Contact Us' ? 'noopener noreferrer' : undefined}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:scale-105 cursor-pointer">
                    <contact.icon className="h-8 w-8 text-blue-300 mx-auto mb-3" />
                    <div className="text-lg font-semibold text-white mb-1">{contact.label}</div>
                    <div className="text-blue-200 hover:underline mb-2">{contact.displayValue}</div>
                    <div className="text-sm text-slate-400">{contact.subtext}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Emergency CTA */}
          {/* <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl border border-blue-400/30">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-yellow-300" />
              <h4 className="text-xl font-bold text-white">Special Offer</h4>
              <Star className="h-6 w-6 text-yellow-300" />
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Register for any course this month and get a FREE one-on-one consultation 
              with our expert instructors. Limited time offer!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold group">
                  Claim Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-300 text-blue-100 hover:bg-blue-500/20"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}