'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HeartReveal — a cute heart that splits open to reveal content.
 * Appears once in view, the heart halves rotate outward like doors opening.
 * Used as a transition element between sections.
 */
interface HeartRevealProps {
  children?: React.ReactNode;
  message?: string;
  delay?: number;
}

export default function HeartReveal({ children, message = 'with love', delay = 0 }: HeartRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center py-16 sm:py-24">
      {/* The heart container */}
      <div className="relative" style={{ width: 90, height: 80 }}>
        {/* Left half */}
        <motion.div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: 45, height: 80, transformOrigin: 'left center' }}
          initial={{ rotateY: 0 }}
          animate={inView ? { rotateY: -55 } : { rotateY: 0 }}
          transition={{ duration: 1.8, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="90" height="80" viewBox="0 0 90 80" className="absolute top-0 left-0">
            <defs>
              <linearGradient id="heart-l-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C8283C" />
                <stop offset="100%" stopColor="#E63C50" />
              </linearGradient>
            </defs>
            <path
              d="M45 75 C20 55 0 40 0 22 C0 8 10 0 22 0 C32 0 40 6 45 15 L45 75Z"
              fill="url(#heart-l-grad)"
              opacity="0.8"
            />
          </svg>
        </motion.div>

        {/* Right half */}
        <motion.div
          className="absolute top-0 right-0 overflow-hidden"
          style={{ width: 45, height: 80, transformOrigin: 'right center' }}
          initial={{ rotateY: 0 }}
          animate={inView ? { rotateY: 55 } : { rotateY: 0 }}
          transition={{ duration: 1.8, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="90" height="80" viewBox="0 0 90 80" className="absolute top-0 right-0">
            <defs>
              <linearGradient id="heart-r-grad" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E63C50" />
                <stop offset="100%" stopColor="#F05064" />
              </linearGradient>
            </defs>
            <path
              d="M45 75 C70 55 90 40 90 22 C90 8 80 0 68 0 C58 0 50 6 45 15 L45 75Z"
              fill="url(#heart-r-grad)"
              opacity="0.8"
            />
          </svg>
        </motion.div>

        {/* Sparkle particles when opening */}
        <AnimatePresence>
          {inView && Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const dist = 35 + Math.random() * 25;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 3 + Math.random() * 3,
                  height: 3 + Math.random() * 3,
                  backgroundColor: i % 2 === 0 ? '#D4A574' : '#E8C4C4',
                  top: '50%', left: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0.3],
                }}
                transition={{ duration: 1.2, delay: delay + 0.8 + i * 0.05, ease: 'easeOut' }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Message revealed */}
      <motion.p
        className="font-serif italic mt-6"
        style={{ color: 'rgba(212,165,116,0.5)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', letterSpacing: '0.08em' }}
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 1, delay: delay + 1.2 }}
      >
        {message}
      </motion.p>

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.8, delay: delay + 1.5 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
