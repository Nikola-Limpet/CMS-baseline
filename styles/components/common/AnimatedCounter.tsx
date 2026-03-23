"use client";

import React, { useEffect, useRef, useState } from 'react';

export type AnimatedCounterProps = {
  to: number;
  duration?: number; // ms, default 1200
  from?: number; // default 0
  className?: string;
  format?: (n: number) => string; // optional formatting (e.g. 1,400+)
};

/**
 * AnimatedCounter animates from 'from' to 'to' when scrolled into view.
 * Accessibility: uses aria-live for screen readers.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  to,
  duration = 1200,
  from = 0,
  className = '',
  format,
}) => {
  const [value, setValue] = useState(from);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let observer: IntersectionObserver | null = null;
    let animationFrame: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(from + (to - from) * progress);
      setValue(current);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setValue(to);
      }
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        requestAnimationFrame(animate);
        observer?.disconnect();
      }
    };

    observer = new IntersectionObserver(handleIntersect, { threshold: 0.2 });
    observer.observe(node);
    return () => {
      if (observer) observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [to, duration, from]);

  // Format number (e.g., 1,400+)
  const display = format ? format(value) : value.toLocaleString();

  return (
    <span ref={ref} className={className} role="status" aria-live="polite">
      {display}
    </span>
  );
};
