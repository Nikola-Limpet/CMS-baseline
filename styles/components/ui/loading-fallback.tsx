import React from 'react';

const LoadingFallback = () => {
  return (
    <div className="w-full flex justify-center items-center py-12">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
