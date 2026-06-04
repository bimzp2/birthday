'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const GOLD  = '#D4A574';
const IVORY = '#FFF8F0';
const ROSE  = '#E8C4C4';
const CHAMPAGNE = '#F5E6D3';

interface StarParticle {
  id: number; x: number; y: number;
  size: number; duration: number; delay: number;
  color: string; type: 'dot' | 'cross' | 'ring';
}

export default function EternalEnding() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<StarParticle[]>([]);
  const [inView, setInView]       = useState(false);
  const [clicked, setClicked]     = useState(false);
  const [burstParticles, setBurstParticles] = useState<{ id: number; angle: number; color: string }[]>([]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end end'] });
  const yBg      = useTransform(scrollYProgress, [0, 1], ['-15%', '0%']);
  const yContent = useTransform(scrollYProgress, [0, 1], ['18%', '0%']);
  const opacity  = useTransform(scrollYProgress, [0.3, 0.75], [0, 1]);
  const scale    = useTransform(scrollYProgress, [0.3, 0.75], [0.94, 1]);

  /* ── Canvas star field ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.3 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.5,
      base: 0.05 + Math.random() * 0.5,
      gold: Math.random() > 0.75,
    }));

    // Milky way band
    const milky = Array.from({ length: 80 }, () => ({
      x: 0.1 + Math.random() * 0.8,
      y: 0.2 + Math.random() * 0.6,
      r: 0.5 + Math.random() * 2.5,
      a: 0.03 + Math.random() * 0.12,
    }));

    let t = 0, raf: number;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Milky way
      for (const m of milky) {
        ctx.beginPath();
        ctx.arc(m.x * canvas.width, m.y * canvas.height, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,230,211,${m.a * (0.6 + 0.4 * Math.sin(t * 0.3))})`;
        ctx.fill();
      }

      // Stars
      for (const s of stars) {
        const a = s.base * (0.4 + 0.6 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? `rgba(212,165,116,${a})` : `rgba(245,230,211,${a})`;
        ctx.fill();
        // Cross for bright stars
        if (s.r > 1.4 && a > 0.3) {
          ctx.strokeStyle = s.gold ? `rgba(212,165,116,${a * 0.5})` : `rgba(245,230,211,${a * 0.4})`;
          ctx.lineWidth = 0.5;
          const px = s.x * canvas.width, py = s.y * canvas.height;
          ctx.beginPath(); ctx.moveTo(px - s.r * 3, py); ctx.lineTo(px + s.r * 3, py); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px, py - s.r * 3); ctx.lineTo(px, py + s.r * 3); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  /* ── Floating particles ── */
  useEffect(() => {
    const pts = Array.from({ length: 55 }).map<StarParticle>((_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: 1 + Math.random() * 3.5,
      duration: 12 + Math.random() * 22,
      delay: Math.random() * 12,
      color: i % 4 === 0 ? GOLD : i % 4 === 1 ? CHAMPAGNE : i % 4 === 2 ? ROSE : IVORY,
      type: i % 5 === 0 ? 'cross' : i % 5 === 1 ? 'ring' : 'dot',
    }));
    setParticles(pts);
    setInView(true);
  }, []);

  /* ── Heart click burst ── */
  const handleHeartClick = () => {
    setClicked(true);
    const burst = Array.from({ length: 22 }, (_, i) => ({ id: i, angle: (i / 22) * Math.PI * 2, color: [GOLD, ROSE, CHAMPAGNE, IVORY, '#FFD700'][i % 5] }));
    setBurstParticles(burst);
    setTimeout(() => setBurstParticles([]), 1500);
    setTimeout(() => setClicked(false), 400);
  };

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0908 0%, #0d0a12 35%, #12101a 60%, #0d0a12 80%, #0A0908 100%)' }}>

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Background aurora */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: yBg }}>
        {[
          { top: '25%', left: '20%', c: 'rgba(212,165,116,0.05)', w: '60%', h: '40%' },
          { top: '55%', left: '30%', c: 'rgba(232,196,196,0.04)', w: '50%', h: '30%' },
          { top: '10%', left: '50%', c: 'rgba(150,100,220,0.03)', w: '40%', h: '50%' },
        ].map((g, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ top: g.top, left: g.left, width: g.w, height: g.h, background: `radial-gradient(ellipse, ${g.c} 0%, transparent 70%)`, filter: 'blur(50px)' }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 10 + i * 4, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }} />
        ))}
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {inView && particles.map(p => (
            <motion.div key={p.id} className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ y: [0, -50, 0], x: [0, (Math.random() - 0.5) * 40, 0], opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}>
              {p.type === 'dot' && (
                <div style={{ width: p.size, height: p.size, background: p.color, borderRadius: '50%', boxShadow: `0 0 ${p.size * 2}px ${p.color}` }} />
              )}
              {p.type === 'cross' && (
                <svg width={p.size * 4} height={p.size * 4} viewBox="0 0 16 16" fill="none">
                  <path d="M8 1 L8 15 M1 8 L15 8" stroke={p.color} strokeWidth="1" opacity="0.6" />
                  <path d="M3 3 L13 13 M3 13 L13 3" stroke={p.color} strokeWidth="0.5" opacity="0.3" />
                </svg>
              )}
              {p.type === 'ring' && (
                <div style={{ width: p.size * 2.5, height: p.size * 2.5, borderRadius: '50%', border: `0.8px solid ${p.color}`, opacity: 0.5, boxShadow: `0 0 4px ${p.color}40` }} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <motion.div className="relative z-20 text-center px-6 max-w-4xl mx-auto"
        style={{ y: yContent, opacity, scale }}>

        {/* Top ornament — interactive heart */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <motion.button className="relative cursor-pointer outline-none"
            onClick={handleHeartClick}
            whileTap={{ scale: 0.9 }}
            animate={clicked ? { scale: [1, 1.3, 1] } : {}}>
            <motion.svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 60 60" fill="none"
              animate={{ rotate: [0, 5, -5, 3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <defs>
                <radialGradient id="star-g" cx="50%" cy="30%">
                  <stop offset="0%" stopColor={GOLD} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={GOLD} stopOpacity="0.2" />
                </radialGradient>
              </defs>
              <path d="M30 2 L33 27 L58 30 L33 33 L30 58 L27 33 L2 30 L27 27 Z" fill="url(#star-g)" />
              <circle cx="30" cy="30" r="4" fill={IVORY} opacity="0.7" />
            </motion.svg>

            {/* Glow on click */}
            <AnimatePresence>
              {clicked && (
                <motion.div className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${GOLD}40 0%, transparent 70%)`, filter: 'blur(10px)' }}
                  initial={{ scale: 1, opacity: 1 }} animate={{ scale: 3, opacity: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
              )}
            </AnimatePresence>

            {/* Burst */}
            <AnimatePresence>
              {burstParticles.map(b => (
                <motion.div key={b.id} className="absolute pointer-events-none rounded-full"
                  style={{ width: 4, height: 4, background: b.color, boxShadow: `0 0 6px ${b.color}`, top: '50%', left: '50%' }}
                  initial={{ x: -2, y: -2, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(b.angle) * 50 - 2, y: Math.sin(b.angle) * 50 - 2, opacity: 0, scale: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }} />
              ))}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Headline */}
        <motion.h2 className="font-serif leading-tight mb-8"
          style={{ color: IVORY, fontWeight: 300, fontSize: 'clamp(1.7rem, 4.5vw, 3.8rem)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Semoga kamu selalu bahagia, <br className="hidden sm:block" />
          <span style={{ color: GOLD }}>hari ini dan seterusnya.</span>
        </motion.h2>

        {/* Divider */}
        <motion.div className="flex items-center justify-center gap-4 my-10">
          <div className="h-px flex-grow max-w-[100px]" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}30)` }} />
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1 L10 7 L16 9 L10 11 L9 17 L8 11 L2 9 L8 7 Z" fill={GOLD} opacity="0.5" />
            </svg>
          </motion.div>
          <div className="h-px flex-grow max-w-[100px]" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}30)` }} />
        </motion.div>

        {/* Closing message */}
        <motion.p className="font-serif italic"
          style={{ color: `${CHAMPAGNE}80`, fontWeight: 300, fontSize: 'clamp(1rem, 2.2vw, 1.5rem)', lineHeight: 1.85 }}>
          Makasih udah jadi bagian dari ceritaku.{' '}
          <br className="hidden sm:block" />
          <motion.span
            className="inline-block mt-4 font-serif"
            style={{ color: `${GOLD}CC`, fontSize: 'clamp(1.3rem, 2.8vw, 2rem)' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            Selamat Ulang Tahun, Asa.
          </motion.span>
        </motion.p>

        {/* Tap hint */}
        <motion.p className="mt-8 font-serif italic"
          style={{ color: `${GOLD}35`, fontSize: '0.65rem', letterSpacing: '0.15em' }}
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
          ketuk bintang di atas
        </motion.p>

        {/* Endless indicator */}
        <motion.div className="mt-20 flex flex-col items-center gap-3"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="w-px h-16" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)` }} />
          <span className="font-serif text-[0.55rem] uppercase tracking-[0.3em]" style={{ color: CHAMPAGNE }}>
            Selamanya
          </span>
          <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
