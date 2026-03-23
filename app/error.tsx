'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="relative h-40 w-40 mx-auto mb-6">
          <Image
            src="/images/move-logo.png"
            alt="MOVE Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-poppins animate-fade-in">
          Something Went Wrong
        </h1>
        
        <div className="h-1.5 w-20 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto mb-6 rounded-full animate-pulse"></div>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={reset}
            className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
          <Link href="/" className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg border border-teal-600 hover:bg-gray-50 transition-colors duration-300">
            Back to Home
          </Link>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/3 left-12 w-24 h-24 bg-teal-500 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-1/3 right-12 w-36 h-36 bg-blue-500 rounded-full opacity-10 animate-float-delay"></div>
      </div>
    </div>
  );
}