"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  offset?: number;
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
  offset = 0,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate transform based on direction
  // Calculate the range based on speed and direction
  const range = 200 * speed;
  let start: number, end: number;
  
  if (direction === "up") {
    start = range + offset;
    end = -range + offset;
  } else if (direction === "down") {
    start = -range + offset;
    end = range + offset;
  } else if (direction === "left") {
    start = range + offset;
    end = -range + offset;
  } else {
    start = -range + offset;
    end = range + offset;
  }
  
  const transformValue = useTransform(scrollYProgress, [0, 1], [start, end]);
  
  const style = {
    y: direction === "up" || direction === "down" ? transformValue : 0,
    x: direction === "left" || direction === "right" ? transformValue : 0,
  };

  return (
    <motion.div
      ref={ref}
      style={style}
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.5,
  direction = "up",
  offset = 0,
  width = 1200,
  height = 800,
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  offset?: number;
  width?: number;
  height?: number;
}) {
  return (
    <ParallaxSection
      speed={speed}
      direction={direction}
      offset={offset}
      className={`relative overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
      />
    </ParallaxSection>
  );
}
