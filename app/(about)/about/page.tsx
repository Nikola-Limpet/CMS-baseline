'use client';

import ShadcnBreadcrumb from '@/components/feature/ShadcnBreadcrumb';
import AboutHero from '@/components/about/AboutHero';
import MissionSection from '@/components/about/MissionSection';
import LeadershipSection from '@/components/about/LeadershipSection';
import { Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';

export default function AboutPage() {
  // Handle smooth scrolling to contact section
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#contact') {
      // Add a small delay to ensure the page has rendered
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-primary-blue">
        <div className="container mx-auto px-4 pt-10 mt-10 mb-10 relative z-10">
          <ShadcnBreadcrumb />
        </div>
        
        {/* Hero Section */}
        <Suspense fallback={<LoadingFallback />}>
          <AboutHero />
        </Suspense>
      </div>
      {/* Leadership Section */}
      <Suspense fallback={<LoadingFallback />}>
        <LeadershipSection />
      </Suspense>
      
      {/* Mission & Vision Section */}
      <Suspense fallback={<LoadingFallback />}>
        <MissionSection />
      </Suspense>
      
      
    
      
             {/* Contact Information */}
       <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Contact MOVE</h2>
            <p className="text-lg text-gray-600">Get in touch with our team for course inquiries, competition registration, or partnership opportunities.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-navy mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-teal-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-navy">Location</h4>
                    <p className="text-gray-600 mt-1">Phnom Penh, Cambodia<br />Serving students across Asia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-teal-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-navy">Phone</h4>
                    <p className="text-gray-600 mt-1">+855 96 446 5954</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-teal-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-navy">Telegram</h4>
                    <p className="text-gray-600 mt-1">@MOVECambodia</p>
                    <p className="text-sm text-gray-500">Primary communication channel</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-teal-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-navy">Operating Hours</h4>
                    <p className="text-gray-600 mt-1">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 3:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-xl border border-teal-100">
                <h3 className="text-xl font-bold text-navy mb-4">Training Courses</h3>
                <p className="text-gray-600 mb-4">Join our on-site s training programs designed for competition preparation and academic excellence.</p>
                <Link href="/courses" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold">
                  View Courses
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-100">
                <h3 className="text-xl font-bold text-navy mb-4">International Competitions</h3>
                <p className="text-gray-600 mb-4">Participate in our competitions with students from across Asia.</p>
                <Link href="/competitions" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                  Join Competitions
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
                <h3 className="text-xl font-bold text-navy mb-4">Study Tours</h3>
                <p className="text-gray-600 mb-4">Explore educational opportunities through our guided study tours and cultural exchange programs.</p>
                <Link href="/study-tours" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold">
                  Explore Tours
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  );
}