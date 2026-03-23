'use client';

import { motion } from 'framer-motion';

export function AuthImagePanel() {
  return (
    <div className="hidden lg:block p-4 pr-0">
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#0a0a0a]">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,_rgba(30,64,175,0.15)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(8,145,178,0.08)_0%,_transparent_70%)] blur-2xl" />
        <div className="absolute top-[40%] right-[-5%] w-[300px] h-[300px] bg-[radial-gradient(circle,_rgba(30,64,175,0.06)_0%,_transparent_70%)] blur-2xl" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xl font-bold text-white">CMS</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-3xl font-serif font-normal leading-tight text-white xl:text-4xl">
              Your Content,
              <br />
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Beautifully Managed.
              </span>
            </h1>
            <p className="max-w-sm text-base text-white/50 leading-relaxed">
              A modern CMS with a powerful blog editor, user management,
              and a dashboard built for speed and simplicity.
            </p>
          </motion.div>

          {/* Bottom accent */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/30 tracking-[0.15em] uppercase">
              Open Source
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
