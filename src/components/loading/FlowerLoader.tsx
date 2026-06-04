'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DARK  = '#0A0908';
const GOLD  = '#D4A574';
const ROSE  = '#E8C4C4';
const IVORY = '#FFF8F0';

const LOADING_PHRASES = [
  'Menyatukan Semesta...',
  'Mengumpulkan Bintang...',
  'Merangkai Kenangan...',
  'Menyiapkan Kejutan...',
];

interface StardustLoaderProps {
  progress: number;
  onComplete: () => void;
}

export default function FlowerLoader({ progress, onComplete }: StardustLoaderProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [visible, setVisible]       = useState(true);
  const [phraseIdx, setPhraseIdx]   = useState(0);
  const canvasRef  = useRef<HTMLCanvasElement>(null);

  /* Phrase cycling */
  useEffect(() => {
    const id = setInterval(() => setPhraseIdx(p => (p + 1) % LOADING_PHRASES.length), 1600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !isComplete) {
      const t = setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 1500);
        }, 1800);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [progress, isComplete, onComplete]);

  /* Canvas — animated particle field */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.3 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.8,
      base: 0.05 + Math.random() * 0.4,
      gold: Math.random() > 0.8,
    }));

    let t = 0, raf: number;
    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const a = s.base * (0.4 + 0.6 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? `rgba(212,165,116,${a})` : `rgba(245,230,211,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const clamped = Math.min(100, Math.max(0, progress));
  const RADIUS  = 44;
  const CIRC    = 2 * Math.PI * RADIUS;

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
          {/* Canvas star field */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Aurora blobs */}
          <motion.div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(230,60,80,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(212,165,116,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

          {/* Loader core */}
          <div className="relative flex items-center justify-center z-10" style={{ width: 180, height: 180 }}>

            {/* Outer rotating dashes ring */}
            <motion.svg className="absolute" style={{ width: 180, height: 180 }} viewBox="0 0 120 120"
              animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <circle cx="60" cy="60" r="52" fill="none" stroke={`${GOLD}18`} strokeWidth="0.5" strokeDasharray="3 6" />
            </motion.svg>

            {/* Progress ring */}
            <AnimatePresence>
              {!isComplete && (
                <motion.svg className="absolute" style={{ width: 160, height: 160 }} viewBox="0 0 100 100"
                  animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  exit={{ scale: 2.5, opacity: 0, transition: { duration: 1.2 } }}>
                  {/* Track */}
                  <circle cx="50" cy="50" r={RADIUS * 0.88} fill="none" stroke={`${GOLD}20`} strokeWidth="0.8" />
                  {/* Progress */}
                  <circle cx="50" cy="50" r={RADIUS * 0.88} fill="none" stroke={GOLD} strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={CIRC * 0.88}
                    strokeDashoffset={CIRC * 0.88 * (1 - clamped / 100)}
                    style={{ transition: 'stroke-dashoffset 0.4s ease-out' }} />
                  {/* Leading dot */}
                  {clamped > 0 && (
                    <circle cx="50" cy="6" r="2.5" fill={GOLD} style={{ filter: `drop-shadow(0 0 4px ${GOLD})` }} />
                  )}
                </motion.svg>
              )}
            </AnimatePresence>

            {/* Inner mandala petals */}
            <AnimatePresence>
              {!isComplete && (
                <motion.div className="absolute" style={{ width: 90, height: 90 }}
                  exit={{ scale: 3, opacity: 0, rotate: 180, transition: { duration: 1 } }}>
                  <motion.svg viewBox="0 0 100 100" className="w-full h-full"
                    animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
                      <motion.ellipse key={i} cx="50" cy="20" rx="6" ry="14"
                        fill={i % 2 === 0 ? ROSE : '#F2D5D0'} opacity={0.3 + (clamped / 100) * 0.4}
                        transform={`rotate(${a} 50 50)`}
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }} />
                    ))}
                    <circle cx="50" cy="50" r="6" fill={GOLD} opacity="0.5" />
                    <circle cx="50" cy="50" r="3" fill={IVORY} opacity="0.6" />
                  </motion.svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center core */}
            <motion.div className="absolute rounded-full"
              style={{ background: GOLD, boxShadow: `0 0 30px ${GOLD}, 0 0 60px ${GOLD}80` }}
              animate={isComplete
                ? { width: [6, 240], height: [6, 240], opacity: [1, 0] }
                : { width: 6, height: 6, opacity: [0.5, 1, 0.5] }}
              transition={isComplete
                ? { duration: 1.4, ease: [0.22, 1, 0.36, 1] }
                : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />

            {/* Completion burst */}
            <AnimatePresence>
              {isComplete && Array.from({ length: 20 }).map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const dist  = 80 + Math.random() * 60;
                const color = [GOLD, ROSE, IVORY, '#FFD700'][i % 4];
                return (
                  <motion.div key={i} className="absolute rounded-full"
                    style={{ width: 4 + Math.random() * 4, height: 4 + Math.random() * 4, background: color, boxShadow: `0 0 8px ${color}` }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1 + Math.random() }}
                    transition={{ duration: 1.6, ease: 'easeOut', delay: i * 0.03 }} />
                );
              })}
            </AnimatePresence>
          </div>

          {/* Text area */}
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div key="loading" className="absolute bottom-1/3 flex flex-col items-center gap-3 z-10"
                exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.8 }}>
                {/* Phrase cycling */}
                <AnimatePresence mode="wait">
                  <motion.p key={phraseIdx}
                    className="font-serif tracking-[0.3em] uppercase"
                    style={{ color: `${GOLD}90`, fontSize: 'clamp(0.55rem, 0.9vw, 0.65rem)' }}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.5 }}>
                    {LOADING_PHRASES[phraseIdx]}
                  </motion.p>
                </AnimatePresence>
                {/* Progress number */}
                <motion.div className="font-serif"
                  style={{ color: IVORY, fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', opacity: 0.5 }}
                  key={Math.round(clamped)}>
                  {Math.round(clamped)}%
                </motion.div>
                {/* Progress bar */}
                <div className="w-32 h-px overflow-hidden rounded-full" style={{ background: `${GOLD}15` }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${GOLD}60, ${GOLD})` }}
                    initial={{ width: 0 }} animate={{ width: `${clamped}%` }}
                    transition={{ ease: 'easeOut' }} />
                </div>
              </motion.div>
            ) : (
              <motion.p key="done" className="absolute bottom-1/3 font-serif tracking-[0.4em] uppercase z-10"
                style={{ color: `${GOLD}80`, fontSize: 'clamp(0.55rem, 0.9vw, 0.65rem)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                siap
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
