'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

/* ─── palette ─── */
const DARK = '#0A0908';
const IVORY = '#FFF8F0';
const CHAMPAGNE = '#F5E6D3';
const BLUSH = '#F2D5D0';
const PEACH = '#EDCFC4';
const ROSE = '#E8C4C4';

const PETAL_COLORS = [BLUSH, PEACH, ROSE, CHAMPAGNE, IVORY];
const PETAL_COUNT = 40;
const TRANSITION_DURATION = 3; // seconds

interface PasscodeTransitionProps {
  onComplete: () => void;
}

/* ─── pre-compute petal data ─── */
interface PetalData {
  angle: number;
  distance: number;
  rotation: number;
  size: number;
  color: string;
  delay: number;
  borderRadius: string;
}

function generatePetals(): PetalData[] {
  return Array.from({ length: PETAL_COUNT }, () => {
    const angle = Math.random() * 360;
    return {
      angle,
      distance: 200 + Math.random() * 400,
      rotation: Math.random() * 720 - 360,
      size: 8 + Math.random() * 18,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      delay: Math.random() * 0.3,
      borderRadius: `${40 + Math.random() * 30}% ${40 + Math.random() * 30}% ${40 + Math.random() * 30}% ${40 + Math.random() * 30}%`,
    };
  });
}

export default function PasscodeTransition({ onComplete }: PasscodeTransitionProps) {
  const petals = useMemo(() => generatePetals(), []);

  /* ─── fire onComplete after transition ─── */
  useEffect(() => {
    const timer = setTimeout(onComplete, TRANSITION_DURATION * 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ backgroundColor: DARK }}
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: 1.05, opacity: 1 }}
      transition={{ duration: TRANSITION_DURATION, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ─── background crossfade: dark → cream ─── */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: IVORY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: TRANSITION_DURATION * 0.8, delay: 0.3, ease: 'easeInOut' }}
      />

      {/* ─── warm light bloom from center ─── */}
      <motion.div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: 100,
          height: 100,
          marginTop: -50,
          marginLeft: -50,
          borderRadius: '50%',
          background: `radial-gradient(circle, white 0%, ${CHAMPAGNE} 40%, ${IVORY}00 70%)`,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 20, opacity: [0, 1, 1, 0.8] }}
        transition={{
          duration: TRANSITION_DURATION * 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* ─── petal explosion ─── */}
      {petals.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;

        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top: '50%',
              left: '50%',
              width: p.size,
              height: p.size * 1.4,
              marginTop: -p.size * 0.7,
              marginLeft: -p.size / 2,
              backgroundColor: p.color,
              borderRadius: p.borderRadius,
              boxShadow: `0 0 8px ${p.color}60`,
            }}
            initial={{
              x: 0,
              y: 0,
              rotate: 0,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: tx,
              y: ty,
              rotate: p.rotation,
              scale: [0, 1.2, 1, 0.6],
              opacity: [0, 1, 0.8, 0],
            }}
            transition={{
              duration: TRANSITION_DURATION * 0.85,
              delay: 0.15 + p.delay,
              ease: [0.16, 1, 0.3, 1], // fast initial, slow deceleration
            }}
          />
        );
      })}

      {/* ─── secondary bloom pulse ─── */}
      <motion.div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: 200,
          height: 200,
          marginTop: -100,
          marginLeft: -100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${CHAMPAGNE}80 0%, transparent 70%)`,
          filter: 'blur(30px)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 4, 8], opacity: [0, 0.6, 0] }}
        transition={{
          duration: TRANSITION_DURATION * 0.7,
          delay: 0.1,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  );
}
