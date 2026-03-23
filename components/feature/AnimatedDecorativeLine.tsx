"use client";

import { useEffect, useState } from 'react';

interface AnimatedDecorativeLineProps {
  color?: string;
  width?: string;
  height?: string;
  className?: string;
  animationDuration?: string;
  animationDelay?: string;
}

export default function AnimatedDecorativeLine({
  color = "from-teal-500 to-blue-600",
  width = "w-24",
  height = "h-1",
  className = "",
  animationDuration = "1.5s",
  animationDelay = "0.2s"
}: AnimatedDecorativeLineProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div 
      className={`overflow-hidden ${className}`}
      style={{ 
        maxWidth: isVisible ? '100%' : '0%',
        transition: `max-width ${animationDuration} ease-in-out`,
        transitionDelay: animationDelay
      }}
    >
      <div className={`${width} ${height} bg-gradient-to-r ${color} rounded-full`}></div>
    </div>
  );
}