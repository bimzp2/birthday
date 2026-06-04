'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DARK       = '#0A0908';
const GOLD       = '#D4A574';
const CHAMPAGNE  = '#F5E6D3';
const IVORY      = '#FFF8F0';

const WISHES = [
  'Semoga langit menjagamu',
  'Harapanku bersamamu',
  'Semoga semua mimpimu jadi nyata',
  'Selalu bahagia, selamanya',
  'Cahayamu menyentuh semua orang',
  'Tahun ini penuh kebaikan',
  'Terbang setinggi bintang',
  'Kamu luar biasa, Asa',
];

const LANTERN_COLORS = [
  { body: '#FF9500', glow: '#FF6600', inner: '#FFE066' },
  { body: '#D4A574', glow: '#B07D44', inner: '#FFF0D0' },
  { body: '#FF8FA3', glow: '#C8003C', inner: '#FFD6E0' },
  { body: '#9B88D4', glow: '#6C3483', inner: '#D7CFFF' },
  { body: '#6AC5A0', glow: '#1A7A43', inner: '#CFFFF0' },
];

interface Lantern {
  id: number; x: number;
  scale: number; speedY: number;
  swayAmp: number; swaySpeed: number;
  colors: typeof LANTERN_COLORS[0];
  wish: string; rotation: number;
}

interface ShootingStar {
  id: number; x: number; y: number; angle: number; duration: number;
}

export default function LanternSky() {
  const [lanterns, setLanterns]           = useState<Lantern[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [totalReleased, setTotalReleased] = useState(0);
  const [burst, setBurst]                 = useState<{ x: number; y: number } | null>(null);
  const [milestone, setMilestone]         = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const idRef        = useRef(0);

  /* ── Twinkling canvas star field ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.3 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.6,
      base: 0.06 + Math.random() * 0.45,
      gold: Math.random() > 0.78,
    }));

    let t = 0, raf: number;
    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const a = s.base * (0.45 + 0.55 * Math.sin(t * s.speed + s.phase));
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

  /* ── Periodic shooting stars ── */
  useEffect(() => {
    const spawn = () => {
      const id = idRef.current++;
      setShootingStars(p => [...p, {
        id, x: 10 + Math.random() * 70, y: 4 + Math.random() * 28,
        angle: 18 + Math.random() * 28, duration: 0.9 + Math.random() * 0.7,
      }]);
      setTimeout(() => setShootingStars(p => p.filter(s => s.id !== id)), 2400);
    };
    const iv = setInterval(spawn, 3800 + Math.random() * 2500);
    return () => clearInterval(iv);
  }, []);

  const releaseLantern = useCallback((e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    let clientX: number;
    if ('touches' in e) clientX = e.touches[0].clientX;
    else clientX = e.clientX;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;

    const newL: Lantern = {
      id: idRef.current++,
      x, scale: 0.6 + Math.random() * 0.65,
      speedY: 2.8 + Math.random() * 2.2,
      swayAmp: 3 + Math.random() * 5,
      swaySpeed: 2 + Math.random() * 2,
      colors: LANTERN_COLORS[Math.floor(Math.random() * LANTERN_COLORS.length)],
      wish: WISHES[Math.floor(Math.random() * WISHES.length)],
      rotation: (Math.random() - 0.5) * 12,
    };

    setLanterns(p => [...p, newL]);
    const next = totalReleased + 1;
    setTotalReleased(next);

    if (next === 5 || next === 10 || next % 15 === 0) {
      setMilestone(true);
      setBurst({ x: clientX, y: (e as React.MouseEvent).clientY ?? rect.top + rect.height / 2 });
      setTimeout(() => { setMilestone(false); setBurst(null); }, 2200);
    }

    setTimeout(() => setLanterns(p => p.filter(l => l.id !== newL.id)), 18000);
  }, [totalReleased]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden cursor-pointer select-none"
      style={{ minHeight: '90vh', background: 'linear-gradient(to top, #1a1510 0%, #0d0b10 55%, #070810 100%)' }}
      onClick={releaseLantern}
      onTouchStart={releaseLantern}
    >
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Aurora ribbons */}
      {[
        { top: '12%', color: 'rgba(110,70,200,0.06)', w: '75%', left: '12%', dur: 14 },
        { top: '42%', color: 'rgba(212,165,116,0.05)', w: '55%', left: '22%', dur: 19 },
        { top: '68%', color: 'rgba(60,140,200,0.04)', w: '65%', left: '8%',  dur: 23 },
      ].map((r, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ top: r.top, left: r.left, width: r.w, height: 55, background: r.color, filter: 'blur(22px)', borderRadius: '50%' }}
          animate={{ scaleX: [1, 1.12, 0.92, 1], opacity: [0.4, 0.85, 0.5, 0.4], y: [0, -10, 8, 0] }}
          transition={{ duration: r.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Shooting stars */}
      <AnimatePresence>
        {shootingStars.map(s => (
          <motion.div key={s.id} className="absolute pointer-events-none"
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: 110, height: 1.5,
              background: 'linear-gradient(to right, transparent, rgba(255,248,240,0.85), transparent)',
              borderRadius: 2, rotate: s.angle, transformOrigin: 'left center',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 0], opacity: [0, 0.85, 0], x: [0, 160] }}
            transition={{ duration: s.duration, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Instruction */}
      <motion.div className="absolute inset-x-0 top-[28%] flex flex-col items-center text-center pointer-events-none z-10 px-6"
        animate={{ opacity: lanterns.length > 3 ? 0 : 1 }} transition={{ duration: 1.5 }}>
        <motion.h2 className="font-serif tracking-[0.18em] uppercase mb-3"
          style={{ color: GOLD, fontSize: 'clamp(1.5rem, 3vw, 2.6rem)', fontWeight: 300 }}
          animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
          Terbangkan Harapan
        </motion.h2>
        <p className="font-serif italic" style={{ color: `${CHAMPAGNE}80`, fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)' }}>
          Ketuk di mana saja untuk melepaskan lampion ke langit
        </p>
        <motion.div className="mt-5 flex justify-center">
          <motion.div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${GOLD}50, transparent)` }}
            animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </motion.div>

      {/* Counter */}
      <AnimatePresence>
        {totalReleased > 0 && (
          <motion.div className="absolute top-6 right-6 z-20 pointer-events-none text-right"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-serif uppercase" style={{ color: `${GOLD}50`, fontSize: '0.58rem', letterSpacing: '0.22em' }}>lampion</p>
            <motion.p className="font-serif" style={{ color: GOLD, fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 300, lineHeight: 1 }}
              key={totalReleased} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {totalReleased}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone burst */}
      <AnimatePresence>
        {burst && Array.from({ length: 22 }).map((_, i) => {
          const angle = (i / 22) * Math.PI * 2;
          const dist  = 90 + Math.random() * 110;
          const col   = [GOLD, CHAMPAGNE, '#E8C4C4', IVORY, '#FFD0A0'][i % 5];
          return (
            <motion.div key={i}
              className="fixed pointer-events-none rounded-full z-50"
              style={{ width: 5 + Math.random() * 4, height: 5 + Math.random() * 4, background: col, boxShadow: `0 0 7px ${col}`, left: burst.x - 2, top: burst.y - 2 }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1 }}
              transition={{ duration: 1.3, ease: 'easeOut', delay: i * 0.02 }}
            />
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {milestone && (
          <motion.div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.6 }}>
            <div className="text-center">
              <p className="font-serif" style={{ color: GOLD, fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)', fontWeight: 300 }}>
                Harapanmu terdengar
              </p>
              <div className="mt-2 flex justify-center">
                <svg width="80" height="1" viewBox="0 0 80 1"><rect width="80" height="1" fill={`${GOLD}40`} /></svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lanterns */}
      <AnimatePresence>
        {lanterns.map(l => (
          <motion.div key={l.id} className="absolute bottom-0 pointer-events-none"
            animate={{
              y: [0, -(typeof window !== 'undefined' ? window.innerHeight * 1.35 : 900)],
              x: [0, l.swayAmp * 12, -l.swayAmp * 14, l.swayAmp * 10, 0],
              opacity: [0, 1, 1, 1, 0.5, 0],
              rotate: [l.rotation, l.rotation * -0.6, l.rotation, l.rotation * -0.4, l.rotation],
            }}
            transition={{
              y: { duration: l.speedY * 9, ease: 'linear' },
              x: { duration: l.swaySpeed * 4, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: l.speedY * 9, times: [0, 0.07, 0.5, 0.82, 0.95, 1] },
              rotate: { duration: l.swaySpeed * 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ left: `${l.x}%`, willChange: 'transform, opacity' }}>

            <div className="relative flex flex-col items-center" style={{ transform: `scale(${l.scale})` }}>
              {/* Wish label */}
              <motion.p className="font-serif italic mb-2 px-3 py-1 rounded-full text-center"
                style={{
                  color: IVORY, fontSize: '0.62rem', letterSpacing: '0.05em',
                  background: 'rgba(10,9,8,0.42)', backdropFilter: 'blur(8px)',
                  border: `1px solid ${l.colors.body}28`, maxWidth: 150,
                }}
                initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: l.speedY * 9, times: [0, 0.08, 0.82, 1] }}>
                {l.wish}
              </motion.p>

              {/* Halo glow */}
              <motion.div className="absolute rounded-full pointer-events-none"
                style={{ width: 78, height: 78, top: 14, left: '50%', transform: 'translateX(-50%)',
                  background: `radial-gradient(circle, ${l.colors.glow}55 0%, transparent 70%)`, filter: 'blur(14px)' }}
                animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />

              {/* Lantern SVG */}
              <svg width="46" height="70" viewBox="0 0 46 70" fill="none">
                <ellipse cx="23" cy="7.5" rx="13" ry="4.5" fill={l.colors.body} opacity="0.88" />
                <rect x="10" y="7" width="26" height="3" fill={l.colors.body} opacity="0.65" />
                <path d="M10 10 Q6 28 9 48 Q13 60 23 62 Q33 60 37 48 Q40 28 36 10 Z"
                  fill={l.colors.body} opacity="0.85" />
                <path d="M14 13 Q10 28 12 46 Q16 56 23 58 Q30 56 34 46 Q36 28 32 13 Z"
                  fill={l.colors.inner} opacity="0.3" />
                <ellipse cx="23" cy="35" rx="14" ry="2.5" fill="none" stroke={l.colors.glow} strokeWidth="0.7" opacity="0.35" />
                {[-8, -3, 2, 7, 12].map((dx, i) => (
                  <path key={i} d={`M${23 + dx} 10 Q${23 + dx - 1.5} 33 ${23 + dx} 62`}
                    stroke={l.colors.glow} strokeWidth="0.45" opacity="0.28" fill="none" />
                ))}
                <ellipse cx="23" cy="62" rx="11" ry="3.5" fill={l.colors.body} opacity="0.75" />
                <path d="M17 66 Q23 70 29 66" stroke={l.colors.glow} strokeWidth="0.7" fill="none" opacity="0.45" />
                <line x1="23" y1="1" x2="23" y2="5" stroke={l.colors.glow} strokeWidth="1.4" opacity="0.55" />
              </svg>

              {/* Flame */}
              <motion.div className="absolute pointer-events-none" style={{ top: -11, left: '50%', transform: 'translateX(-50%)' }}
                animate={{ scaleY: [1, 1.22, 0.82, 1.14, 1], scaleX: [1, 0.85, 1.12, 0.9, 1], rotate: [-3, 4, -2, 3, -3] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}>
                <div style={{
                  width: 9, height: 15,
                  borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
                  background: `radial-gradient(ellipse at 50% 80%, ${l.colors.inner}, ${l.colors.body}, transparent)`,
                  boxShadow: `0 0 9px ${l.colors.body}, 0 0 18px ${l.colors.glow}`,
                }} />
              </motion.div>

              {/* Rising sparks */}
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="absolute pointer-events-none rounded-full"
                  style={{ width: 2, height: 2, background: l.colors.inner, top: -14, left: `${30 + i * 20}%`, boxShadow: `0 0 4px ${l.colors.inner}` }}
                  animate={{ y: [0, -18, -32], opacity: [0.9, 0.45, 0], scale: [1, 0.6, 0] }}
                  transition={{ duration: 1.1, delay: i * 0.38, repeat: Infinity, ease: 'easeOut' }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ground vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(26,21,16,0.85), transparent)' }} />
    </section>
  );
}
