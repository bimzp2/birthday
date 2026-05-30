'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DARK = '#0A0908';
const GOLD = '#D4A574';

interface StardustLoaderProps {
  progress: number;
  onComplete: () => void;
}

export default function FlowerLoader({ progress, onComplete }: StardustLoaderProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress >= 100 && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        // Wait for the completion burst animation
        setTimeout(() => {
          setVisible(false);
          // Wait for fade out
          setTimeout(onComplete, 1500); 
        }, 1500);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, isComplete, onComplete]);

  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: DARK }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          {/* Subtle noise texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          <div className="relative flex items-center justify-center w-64 h-64">
            
            {/* The central glowing core */}
            <motion.div className="absolute rounded-full"
              style={{ background: GOLD, boxShadow: `0 0 40px ${GOLD}, 0 0 80px ${GOLD}` }}
              animate={
                isComplete 
                ? { width: [4, 200], height: [4, 200], opacity: [1, 0] } 
                : { width: 4, height: 4, opacity: [0.4, 1, 0.4] }
              }
              transition={
                isComplete 
                ? { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
                : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }
            />

            {/* Orbital Progress Rings */}
            <AnimatePresence>
              {!isComplete && (
                <>
                  <motion.svg className="absolute w-full h-full" viewBox="0 0 100 100"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    exit={{ scale: 2, opacity: 0, transition: { duration: 1 } }}>
                    <circle cx="50" cy="50" r="30" fill="none" stroke={`${GOLD}33`} strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke={GOLD} strokeWidth="1"
                      strokeDasharray="188.5" strokeDashoffset={188.5 - (188.5 * clamped) / 100}
                      strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
                  </motion.svg>

                  <motion.svg className="absolute w-full h-full" viewBox="0 0 100 100"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    exit={{ scale: 3, opacity: 0, transition: { duration: 1.2 } }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke={`${GOLD}22`} strokeWidth="0.5" strokeDasharray="4 4" />
                  </motion.svg>
                </>
              )}
            </AnimatePresence>
            
            {/* Completion Burst Particles */}
            <AnimatePresence>
              {isComplete && Array.from({ length: 12 }).map((_, i) => (
                <motion.div key={i} className="absolute w-1 h-1 rounded-full"
                  style={{ background: '#FFF8F0', boxShadow: `0 0 10px #FFF8F0` }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{ 
                    x: Math.cos((i / 12) * Math.PI * 2) * 150, 
                    y: Math.sin((i / 12) * Math.PI * 2) * 150, 
                    opacity: 0,
                    scale: Math.random() * 2 + 1
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!isComplete && (
              <motion.div className="absolute bottom-1/3 flex flex-col items-center gap-2"
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.8 }}>
                <p className="font-serif tracking-[0.3em] uppercase text-xs" style={{ color: `${GOLD}99` }}>
                  Menyatukan Semesta
                </p>
                <div className="text-sm font-serif italic" style={{ color: '#FFF8F0', opacity: 0.6 }}>
                  {Math.round(clamped)}%
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
