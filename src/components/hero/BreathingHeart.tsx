'use client';

import { motion } from 'framer-motion';

/**
 * BreathingHeart — A beautiful, layered, glowing SVG heart that breathes slowly.
 */
export default function BreathingHeart() {
  return (
    <div className="relative flex items-center justify-center w-full h-full pointer-events-none">
      {/* Outer ambient glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          maxWidth: '500px',
          maxHeight: '500px',
          background: 'radial-gradient(circle, rgba(230, 60, 80, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* The Heart itself */}
      <motion.div
        className="relative z-10"
        style={{ width: 'clamp(180px, 30vw, 320px)', height: 'clamp(180px, 30vw, 320px)' }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 30px rgba(230, 60, 80, 0.6))' }}>
          <defs>
            <linearGradient id="bh-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="50%" stopColor="#c9184a" />
              <stop offset="100%" stopColor="#800f2f" />
            </linearGradient>
            <radialGradient id="bh-glow" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fff0f3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M50 85 C20 60 5 40 5 22 C5 8 18 0 32 0 C43 0 48 8 50 12 C52 8 57 0 68 0 C82 0 95 8 95 22 C95 40 80 60 50 85Z"
            fill="url(#bh-grad)"
          />
          {/* Inner glossy highlight */}
          <path
            d="M50 85 C20 60 5 40 5 22 C5 8 18 0 32 0 C43 0 48 8 50 12 C52 8 57 0 68 0 C82 0 95 8 95 22 C95 40 80 60 50 85Z"
            fill="url(#bh-glow)"
          />
        </svg>

        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.2 }}
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path
              d="M50 85 C20 60 5 40 5 22 C5 8 18 0 32 0 C43 0 48 8 50 12 C52 8 57 0 68 0 C82 0 95 8 95 22 C95 40 80 60 50 85Z"
              stroke="rgba(255, 77, 109, 0.5)"
              strokeWidth="2"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
