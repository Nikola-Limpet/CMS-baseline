'use client'

import { motion } from 'framer-motion'

export function FloatingShapes() {
  const shapes = [
    { 
      d: "M50,30 Q80,10 110,30 T170,30 Q200,50 170,70 T110,70 Q80,90 50,70 T50,30", 
      color: "rgba(255, 255, 255, 0.1)",
      duration: 20,
      delay: 0,
      scale: 1.2
    },
    { 
      d: "M20,50 L80,20 L140,50 L140,110 L80,140 L20,110 Z", 
      color: "rgba(255, 255, 255, 0.08)",
      duration: 25,
      delay: 5,
      scale: 0.8
    },
    { 
      d: "M60,20 Q100,40 60,60 Q20,40 60,20", 
      color: "rgba(255, 255, 255, 0.06)",
      duration: 15,
      delay: 10,
      scale: 1.5
    },
    {
      d: "M30,30 L60,15 L90,30 L90,60 L60,75 L30,60 Z",
      color: "rgba(255, 255, 255, 0.05)",
      duration: 30,
      delay: 3,
      scale: 1
    }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.svg
          key={index}
          className="absolute"
          width="200"
          height="200"
          style={{
            left: `${20 + index * 20}%`,
            top: `${10 + index * 15}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: shape.scale,
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path
            d={shape.d}
            fill={shape.color}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />
        </motion.svg>
      ))}
      
      {/* Mathematical symbols floating - using deterministic positions to avoid hydration mismatch */}
      <div className="absolute inset-0">
        {[
          { symbol: '∑', left: 15, top: 20 },
          { symbol: '∫', left: 75, top: 15 },
          { symbol: '∞', left: 25, top: 70 },
          { symbol: 'π', left: 85, top: 60 },
          { symbol: '√', left: 45, top: 25 },
          { symbol: 'Δ', left: 60, top: 80 },
          { symbol: 'θ', left: 10, top: 50 },
          { symbol: 'λ', left: 90, top: 40 },
        ].map(({ symbol, left, top }, index) => (
          <motion.div
            key={symbol}
            className="absolute text-white/10 text-4xl font-bold"
            style={{
              left: `${left}%`,
              top: `${top}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>
    </div>
  )
}