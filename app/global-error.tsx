'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
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
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-poppins">
              Critical Error
            </h1>
            
            <div className="h-1.5 w-20 bg-gradient-to-r from-red-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We&apos;ve encountered a critical error. Our team has been automatically notified.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-teal-600 text-white font-medium rounded-[0.55rem] hover:bg-teal-700 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
              <Link href="/" className="px-6 py-3 bg-white text-teal-600 font-medium rounded-[0.55rem] border border-teal-600 hover:bg-gray-50 transition-colors duration-300">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}