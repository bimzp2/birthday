'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * BreathingHeart — Layered, glowing, pulsing SVG heart with
 * orbital particles, aurora rings, and floating sparkles.
 */
export default function BreathingHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Canvas sparkle particles around the heart ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Spark {
      angle: number; dist: number; size: number; speed: number; opacity: number;
      opSpeed: number; opPhase: number; color: string;
    }
    const COLORS = ['rgba(255,120,140,', 'rgba(212,165,116,', 'rgba(255,200,200,', 'rgba(255,240,200,'];
    const sparks: Spark[] = Array.from({ length: 35 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist:  80 + Math.random() * 140,
      size:  0.8 + Math.random() * 2.5,
      speed: (0.002 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
      opacity: 0.08 + Math.random() * 0.35,
      opSpeed: 0.01 + Math.random() * 0.03,
      opPhase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let t = 0, raf: number;
    const cx = () => canvas.width  / 2;
    const cy = () => canvas.height / 2;

    const draw = () => {
      t += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of sparks) {
        s.angle += s.speed;
        const a = s.opacity * (0.5 + 0.5 * Math.sin(t * s.opSpeed * 10 + s.opPhase));
        const x = cx() + Math.cos(s.angle) * s.dist;
        const y = cy() + Math.sin(s.angle) * s.dist * 0.85;
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${a})`;
        ctx.fill();
        // Star shape for bigger ones
        if (s.size > 1.8) {
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const ra = (i / 4) * Math.PI * 2;
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(ra) * s.size * 2.5, y + Math.sin(ra) * s.size * 2.5);
          }
          ctx.strokeStyle = `${s.color}${a * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full pointer-events-none">

      {/* Canvas orbital sparks */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

      {/* Deep ambient glow */}
      <motion.div className="absolute rounded-full"
        style={{ width: '65vw', height: '65vw', maxWidth: 560, maxHeight: 560,
          background: 'radial-gradient(circle, rgba(230,60,80,0.18) 0%, rgba(212,165,116,0.06) 50%, transparent 75%)',
          filter: 'blur(50px)' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Aurora ring 1 */}
      <motion.div className="absolute rounded-full"
        style={{ width: 'clamp(280px, 38vw, 420px)', height: 'clamp(280px, 38vw, 420px)',
          border: '1px solid rgba(230,60,80,0.12)',
          boxShadow: '0 0 30px rgba(230,60,80,0.08) inset' }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 360] }}
        transition={{ scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 25, repeat: Infinity, ease: 'linear' } }} />

      {/* Aurora ring 2 */}
      <motion.div className="absolute rounded-full"
        style={{ width: 'clamp(340px, 46vw, 500px)', height: 'clamp(340px, 46vw, 500px)',
          border: '1px solid rgba(212,165,116,0.08)' }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.2, 0.5, 0.2], rotate: [0, -360] }}
        transition={{ scale: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }, opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 35, repeat: Infinity, ease: 'linear' } }} />

      {/* Pulse rings */}
      {[0, 0.6, 1.2].map((delay, i) => (
        <motion.div key={i} className="absolute"
          style={{ width: 'clamp(180px, 28vw, 320px)', height: 'clamp(180px, 28vw, 320px)' }}>
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M50 85 C20 60 5 40 5 22 C5 8 18 0 32 0 C43 0 48 8 50 12 C52 8 57 0 68 0 C82 0 95 8 95 22 C95 40 80 60 50 85Z"
              stroke={`rgba(255,${i === 0 ? 77 : i === 1 ? 100 : 60},${i === 0 ? 109 : i === 1 ? 140 : 80},${0.5 - i * 0.12})`}
              strokeWidth={1.5 - i * 0.3} />
          </svg>
          <motion.div className="absolute inset-0"
            animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay }}>
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M50 85 C20 60 5 40 5 22 C5 8 18 0 32 0 C43 0 48 8 50 12 C52 8 57 0 68 0 C82 0 95 8 95 22 C95 40 80 60 50 85Z"
                stroke="rgba(255,77,109,0.45)" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* Heart body */}
      <motion.div className="relative z-10"
        style={{ width: 'clamp(180px, 28vw, 320px)', height: 'clamp(180px, 28vw, 320px)' }}
        animate={{ scale: [1, 1.07, 1, 1.04, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1], times: [0, 0.3, 0.5, 0.7, 1] }}>

        {/* Outer Glow replaces expensive SVG drop-shadow */}
        <div className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(230,60,80,0.5) 0%, rgba(212,165,116,0.1) 50%, transparent 70%)',
            filter: 'blur(15px)', transform: 'scale(1.2)'
          }} />
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="bh-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="40%" stopColor="#c9184a" />
              <stop offset="100%" stopColor="#800f2f" />
            </linearGradient>
            <radialGradient id="bh-glow" cx="30%" cy="25%" r="70%">
              <stop offset="0%" stopColor="#fff0f3" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#ff4d6d" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bh-deep" cx="70%" cy="75%" r="60%">
              <stop offset="0%" stopColor="#4a0010" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4a0010" stopOpacity="0" />
            </radialGradient>
            <filter id="bh-blur">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>
          <path d="M50 85 C20 60 5 40 5 22 C5 8 18 0 32 0 C43 0 48 8 50 12 C52 8 57 0 68 0 C82 0 95 8 95 22 C95 40 80 60 50 85Z"
            fill="url(#bh-grad)" />
          <path d="M50 85 C20 60 5 40 5 22 C5 8 18 0 32 0 C43 0 48 8 50 12 C52 8 57 0 68 0 C82 0 95 8 95 22 C95 40 80 60 50 85Z"
            fill="url(#bh-glow)" />
          <path d="M50 85 C20 60 5 40 5 22 C5 8 18 0 32 0 C43 0 48 8 50 12 C52 8 57 0 68 0 C82 0 95 8 95 22 C95 40 80 60 50 85Z"
            fill="url(#bh-deep)" />
          {/* Inner shine streak */}
          <path d="M25 8 Q32 20 28 38" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#bh-blur)" />
        </svg>

        {/* Gold accent ring around heart */}
        <motion.div className="absolute inset-0"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M50 85 C20 60 5 40 5 22 C5 8 18 0 32 0 C43 0 48 8 50 12 C52 8 57 0 68 0 C82 0 95 8 95 22 C95 40 80 60 50 85Z"
              stroke="rgba(212,165,116,0.4)" strokeWidth="0.5" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Floating mini hearts */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle  = (i / 8) * Math.PI * 2;
        const radius = 140 + (i % 2) * 40;
        const xOff   = Math.cos(angle) * radius;
        const yOff   = Math.sin(angle) * radius * 0.8;
        return (
          <motion.div key={i} className="absolute pointer-events-none"
            style={{ left: `calc(50% + ${xOff}px)`, top: `calc(50% + ${yOff}px)`, transform: 'translate(-50%,-50%)' }}
            animate={{ y: [0, -8, 0], opacity: [0.15, 0.4, 0.15], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}>
            <svg width="10" height="9" viewBox="0 0 20 18" fill="rgba(230,60,80,0.5)">
              <path d="M10 17 C4 11 0 7 0 4 C0 1 3 0 6 0 C8 0 9.5 1.5 10 3 C10.5 1.5 12 0 14 0 C17 0 20 1 20 4 C20 7 16 11 10 17Z" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
