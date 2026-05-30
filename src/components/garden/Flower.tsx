'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlowerData } from '@/types';

/* ── Helpers ────────────────────────────────────────────── */
function darkenHex(hex: string, amount = 30): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Types ──────────────────────────────────────────────── */
interface FlowerProps extends FlowerData {
  onReveal: (message: string) => void;
}

interface PetalParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

/* ── Component ─────────────────────────────────────────── */
export default function Flower({
  id,
  color,
  petalCount,
  size,
  message,
  delay,
  onReveal,
}: FlowerProps) {
  const [bloomed, setBloomed] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [particles, setParticles] = useState<PetalParticle[]>([]);

  const strokeColor = darkenHex(color, 35);

  /* ── Generate petal angles ── */
  const petals = useMemo(() => {
    return Array.from({ length: petalCount }, (_, i) => ({
      angle: (360 / petalCount) * i,
      index: i,
    }));
  }, [petalCount]);

  /* ── Click handler: show tooltip + particles ── */
  const handleClick = useCallback(() => {
    onReveal(message);
    setTooltipVisible(true);

    const rng = seededRandom(Date.now());
    const count = 5 + Math.floor(rng() * 4); // 5-8
    const newParticles: PetalParticle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: (rng() - 0.5) * 120,
      y: -(40 + rng() * 80),
      rotation: rng() * 360,
      scale: 0.4 + rng() * 0.6,
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setTooltipVisible(false);
      setParticles([]);
    }, 3200);
  }, [message, onReveal]);

  /* ── Dimensions ── */
  const svgWidth = 100;
  const svgHeight = 160;
  const cx = 50;
  const cy = 55;

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{
        width: svgWidth,
        height: svgHeight,
        transform: `scale(${size})`,
        transformOrigin: 'bottom center',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: delay,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      onHoverStart={() => setBloomed(true)}
      onHoverEnd={() => {
        if (!tooltipVisible) setBloomed(false);
      }}
      onClick={handleClick}
    >
      {/* ── Tooltip ── */}
      <AnimatePresence>
        {tooltipVisible && (
          <motion.div
            className="absolute left-1/2 z-20 w-48 rounded-xl px-4 py-3 text-center"
            style={{
              bottom: '105%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 248, 240, 0.85)',
              backdropFilter: 'blur(20px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
              border: '1px solid rgba(212, 165, 116, 0.25)',
              boxShadow:
                '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
            initial={{ opacity: 0, y: 8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -6, x: '-50%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <p
              className="font-serif text-sm leading-snug italic"
              style={{ color: '#1A1614' }}
            >
              &ldquo;{message}&rdquo;
            </p>
            {/* Tooltip arrow */}
            <div
              className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45"
              style={{
                background: 'rgba(255, 248, 240, 0.85)',
                borderRight: '1px solid rgba(212, 165, 116, 0.25)',
                borderBottom: '1px solid rgba(212, 165, 116, 0.25)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Petal burst particles ── */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="pointer-events-none absolute"
            style={{
              left: cx,
              top: cy,
              width: 10,
              height: 14,
              borderRadius: '50% 50% 50% 0',
              background: `linear-gradient(135deg, ${color} 0%, ${strokeColor} 100%)`,
              transformOrigin: 'center center',
            }}
            initial={{ opacity: 0.9, x: 0, y: 0, scale: p.scale, rotate: 0 }}
            animate={{
              opacity: 0,
              x: p.x,
              y: p.y,
              scale: p.scale * 0.3,
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </AnimatePresence>

      {/* ── SVG Flower ── */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width={svgWidth}
        height={svgHeight}
        className="overflow-visible"
        aria-label={`Flower ${id}`}
      >
        {/* ── Stem ── */}
        <motion.path
          d={`M ${cx} ${cy + 16} Q ${cx - 6} ${cy + 50} ${cx + 2} ${svgHeight}`}
          fill="none"
          stroke="#8B9D83"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: delay, duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
        />

        {/* ── Small leaf on stem ── */}
        <motion.ellipse
          cx={cx - 7}
          cy={cy + 40}
          rx={6}
          ry={3}
          fill="#8B9D83"
          opacity={0.6}
          transform={`rotate(-30, ${cx - 7}, ${cy + 40})`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.6, duration: 0.6 }}
        />

        {/* ── Petals ── */}
        {petals.map(({ angle, index }) => (
          <motion.ellipse
            key={`petal-${id}-${index}`}
            cx={cx}
            cy={cy - 14}
            rx={8}
            ry={18}
            fill={color}
            stroke={strokeColor}
            strokeWidth={0.5}
            opacity={0.85}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
            }}
            initial={{
              scale: 0,
              rotate: angle,
              opacity: 0,
            }}
            animate={
              bloomed
                ? { scale: 1, rotate: angle, opacity: 0.85 }
                : { scale: 0, rotate: angle, opacity: 0 }
            }
            transition={{
              delay: bloomed ? index * 0.08 : 0,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          />
        ))}

        {/* ── Center (stamen) ── */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={6}
          fill="#D4A574"
          stroke="#C4955A"
          strokeWidth={0.5}
          animate={
            bloomed
              ? { scale: [1, 1.2, 1], r: 6 }
              : { scale: 1, r: 4 }
          }
          transition={{
            duration: bloomed ? 1.4 : 0.3,
            repeat: bloomed ? Infinity : 0,
            repeatType: 'reverse',
            ease: [0.4, 0, 0.2, 1],
          }}
        />

        {/* ── Center highlight ── */}
        <circle
          cx={cx - 1.5}
          cy={cy - 1.5}
          r={2}
          fill="rgba(255,255,255,0.3)"
        />
      </svg>

      {/* ── Glow under flower ── */}
      <AnimatePresence>
        {bloomed && (
          <motion.div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              bottom: '15%',
              width: 60,
              height: 20,
              background: `radial-gradient(ellipse, ${color}40 0%, transparent 70%)`,
              filter: 'blur(8px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
