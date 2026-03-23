import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
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
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 font-poppins animate-fade-in">
          404
        </h1>
        
        <div className="h-1.5 w-20 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto mb-6 rounded-full animate-pulse"></div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 font-poppins animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Link href="/" className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors duration-300 shadow-md hover:shadow-lg">
            Back to Home
          </Link>
          <Link href="/competitions" className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg border border-teal-600 hover:bg-gray-50 transition-colors duration-300">
            Explore Competitions
          </Link>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-teal-500 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-float-delay"></div>
      </div>
    </div>
  );
}