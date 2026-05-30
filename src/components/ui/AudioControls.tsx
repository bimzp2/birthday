'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useAudio } from '@/components/providers/AudioProvider';

export default function AudioControls() {
  const { isPlaying, volume, togglePlay, setVolume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const handleToggle = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, width: 0, x: 10 }}
            animate={{ opacity: 1, width: 100, x: 0 }}
            exit={{ opacity: 0, width: 0, x: 10 }}
            className="overflow-hidden"
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #D4A574 ${volume * 100}%, rgba(255,248,240,0.1) ${volume * 100}%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer"
        style={{
          background: 'rgba(255, 248, 240, 0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 165, 116, 0.15)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.svg
              key="pause"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <rect x="3" y="2" width="3.5" height="12" rx="1" fill="#D4A574" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="#D4A574" />
            </motion.svg>
          ) : (
            <motion.svg
              key="play"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M4 2.5L13 8L4 13.5V2.5Z" fill="#D4A574" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Audio visualization bars */}
        {isPlaying && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: '#D4A574' }}
                animate={{
                  height: [3, 8, 4, 10, 3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </motion.button>
    </motion.div>
  );
}
