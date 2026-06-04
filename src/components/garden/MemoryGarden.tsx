'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FLOWERS: FlowerItem[] = [
  { id: 1, x: 10, y: 30, size: 1.25, color: '#E8C4C4', accent: '#D4A574', message: 'Kamu membuat dunia mekar', petalCount: 6, delay: 0 },
  { id: 2, x: 25, y: 62, size: 0.95, color: '#F2D5D0', accent: '#E8C4C4', message: 'Setiap momen bersamamu adalah hadiah yang nyata', petalCount: 5, delay: 0.2 },
  { id: 3, x: 42, y: 25, size: 1.15, color: '#EDCFC4', accent: '#D4A574', message: 'Cahayamu menjangkau lebih jauh dari yang kamu tahu', petalCount: 7, delay: 0.4 },
  { id: 4, x: 57, y: 58, size: 1.05, color: '#F5E6D3', accent: '#C9A070', message: 'Kamu adalah kehangatan di setiap musim', petalCount: 6, delay: 0.6 },
  { id: 5, x: 73, y: 28, size: 1.35, color: '#E8C4C4', accent: '#D4A574', message: 'Ada jiwa yang seperti taman — milikmu tak terbatas', petalCount: 8, delay: 0.8 },
  { id: 6, x: 87, y: 52, size: 0.9,  color: '#F2D5D0', accent: '#E8C4C4', message: 'Tumbuh, selalu tumbuh, selalu indah', petalCount: 5, delay: 1.0 },
  { id: 7, x: 50, y: 74, size: 1.05, color: '#EDCFC4', accent: '#D4A574', message: 'Bunga tak pernah bersaing — ia hanya mekar', petalCount: 6, delay: 1.2 },
  { id: 8, x: 18, y: 52, size: 1.1,  color: '#E8C4C4', accent: '#C9A070', message: 'Berakar dalam cinta, meraih cahaya', petalCount: 7, delay: 0.3 },
];

interface FlowerItem {
  id: number; x: number; y: number; size: number;
  color: string; accent: string; message: string;
  petalCount: number; delay: number;
}

/* ── Animated butterfly ── */
function Butterfly({ x, y }: { x: number; y: number }) {
  return (
    <motion.div className="absolute pointer-events-none z-20"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ x: [0, 30, 60, 80, 60, 30, 0], y: [0, -20, -5, -25, -10, 5, 0], rotate: [0, 10, -5, 8, -3, 5, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}>
      <motion.svg width="28" height="22" viewBox="0 0 50 40" fill="none"
        animate={{ scaleX: [1, 0.2, 1, 0.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}>
        <defs>
          <linearGradient id="bf-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F2D5D0" /><stop offset="100%" stopColor="#E8C4C4" />
          </linearGradient>
          <linearGradient id="bf-g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4A574" /><stop offset="100%" stopColor="#EDCFC4" />
          </linearGradient>
        </defs>
        <path d="M25 20 C20 10 8 4 4 12 C0 20 10 26 25 20Z" fill="url(#bf-g1)" opacity="0.7" />
        <path d="M25 20 C30 10 42 4 46 12 C50 20 40 26 25 20Z" fill="url(#bf-g2)" opacity="0.65" />
        <path d="M25 20 C22 26 16 32 14 28 C12 24 18 22 25 20Z" fill="url(#bf-g1)" opacity="0.5" />
        <path d="M25 20 C28 26 34 32 36 28 C38 24 32 22 25 20Z" fill="url(#bf-g2)" opacity="0.45" />
        <line x1="25" y1="14" x2="25" y2="32" stroke="#C49460" strokeWidth="0.6" opacity="0.3" />
      </motion.svg>
    </motion.div>
  );
}

/* ── Individual flower ── */
function GardenFlower({ flower, index }: { flower: FlowerItem; index: number }) {
  const [bloomed, setBloomed]     = useState(false);
  const [showMsg, setShowMsg]     = useState(false);
  const [petals, setPetals]       = useState<number[]>([]);
  const [sparkles, setSparkles]   = useState<number[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const petalDefs = useMemo(() =>
    Array.from({ length: flower.petalCount }, (_, i) => ({
      angle: (360 / flower.petalCount) * i,
      rx: 7 + Math.random() * 5,
      ry: 14 + Math.random() * 7,
      offset: Math.random() * 0.15,
    })), [flower.petalCount]);

  const handleHover = () => setBloomed(true);
  const handleLeave = () => { if (!showMsg) setBloomed(false); };

  const handleClick = () => {
    const n = clickCount + 1;
    setClickCount(n);
    setShowMsg(true);
    setPetals(Array.from({ length: 8 }, (_, i) => i));
    setSparkles(Array.from({ length: 12 }, (_, i) => i));
    setTimeout(() => setShowMsg(false), 4000);
    setTimeout(() => setPetals([]), 2000);
    setTimeout(() => setSparkles([]), 1500);
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${flower.x}%`, top: `${flower.y}%`, zIndex: bloomed ? 15 : 5 }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: flower.size, opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.2, delay: flower.delay, ease: [0.34, 1.56, 0.64, 1] }}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      whileHover={{ scale: flower.size * 1.08 }}
      whileTap={{ scale: flower.size * 0.95 }}
    >
      <svg viewBox="0 0 60 120" className="w-12 h-24 sm:w-14 sm:h-28" fill="none">
        {/* Stem with leaf */}
        <motion.path d="M30 115 Q28 85 30 65"
          stroke="#8B9D83" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1, delay: flower.delay + 0.3 }} />
        {/* Leaf */}
        <motion.ellipse cx="22" cy="88" rx="8" ry="3" fill="#8B9D83" opacity="0.22"
          transform="rotate(-20 22 88)"
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: flower.delay + 0.5 }} />
        <motion.ellipse cx="37" cy="76" rx="6" ry="2.5" fill="#8B9D83" opacity="0.18"
          transform="rotate(15 37 76)"
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: flower.delay + 0.7 }} />

        {/* Petals */}
        <g transform="translate(30, 52)">
          {petalDefs.map((p, i) => (
            <motion.ellipse key={i}
              cx="0" cy={-p.ry * 0.55 - p.offset * 10}
              rx={p.rx} ry={p.ry}
              fill={flower.color}
              opacity={0.5 + i * 0.035}
              transform={`rotate(${p.angle})`}
              initial={{ scale: 0.15, opacity: 0 }}
              animate={bloomed ? { scale: 1, opacity: 0.55 + i * 0.03 } : { scale: 0.15, opacity: 0 }}
              transition={{ duration: 0.9, delay: i * 0.07, ease: [0.34, 1.56, 0.64, 1] }} />
          ))}
          {/* Center disc */}
          <motion.circle cx="0" cy="0" r="6" fill={flower.accent} opacity="0.65"
            initial={{ scale: 0 }} animate={bloomed ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: petalDefs.length * 0.07 }} />
          <motion.circle cx="0" cy="0" r="3" fill="#C49460" opacity="0.55"
            initial={{ scale: 0 }} animate={bloomed ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.4, delay: petalDefs.length * 0.07 + 0.1 }} />
          {/* Pollen dots */}
          {bloomed && [0, 60, 120, 180, 240, 300].map(a => (
            <motion.circle key={a} cx={Math.cos(a * Math.PI / 180) * 4.5} cy={Math.sin(a * Math.PI / 180) * 4.5} r="0.8"
              fill="#FFD700" opacity="0.5"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
          ))}
        </g>
      </svg>

      {/* Petal burst */}
      <AnimatePresence>
        {petals.map(i => {
          const a = (i / 8) * Math.PI * 2;
          const d = 25 + Math.random() * 40;
          return (
            <motion.div key={`p-${i}`} className="absolute pointer-events-none"
              style={{ width: 6 + Math.random() * 5, height: 9 + Math.random() * 6, borderRadius: '50% 50% 50% 0', backgroundColor: flower.color, top: '35%', left: '50%' }}
              initial={{ x: 0, y: 0, opacity: 0.9, rotate: 0 }}
              animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d - 20, opacity: 0, rotate: Math.random() * 720 }}
              transition={{ duration: 1.5, ease: 'easeOut' }} />
          );
        })}
      </AnimatePresence>

      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map(i => {
          const a = (i / 12) * Math.PI * 2;
          const d = 20 + Math.random() * 35;
          return (
            <motion.div key={`s-${i}`} className="absolute pointer-events-none rounded-full"
              style={{ width: 2.5, height: 2.5, background: flower.accent, boxShadow: `0 0 4px ${flower.accent}`, top: '40%', left: '50%' }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d - 15, opacity: 0, scale: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: i * 0.03 }} />
          );
        })}
      </AnimatePresence>

      {/* Message tooltip */}
      <AnimatePresence>
        {showMsg && (
          <motion.div
            className="absolute -top-20 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl z-30 whitespace-nowrap"
            style={{
              background: 'rgba(255,248,240,0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid rgba(212,165,116,0.2)`,
              boxShadow: '0 8px 30px rgba(26,22,20,0.08), 0 0 20px rgba(212,165,116,0.1)',
              maxWidth: 220, whiteSpace: 'normal', textAlign: 'center',
            }}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}>
            <p className="font-serif text-center" style={{ color: '#1A1614', fontSize: '0.72rem', fontWeight: 400, lineHeight: 1.5 }}>
              {flower.message}
            </p>
            {/* Arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
              style={{ background: 'rgba(255,248,240,0.95)', borderRight: '1px solid rgba(212,165,116,0.2)', borderBottom: '1px solid rgba(212,165,116,0.2)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click count badge */}
      {clickCount > 1 && (
        <motion.div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center pointer-events-none z-20"
          style={{ background: flower.accent, boxShadow: `0 0 8px ${flower.accent}` }}
          key={clickCount} initial={{ scale: 1.5 }} animate={{ scale: 1 }}>
          <span className="font-sans text-white" style={{ fontSize: '8px', fontWeight: 600 }}>{clickCount}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Main Section ── */
export default function MemoryGarden() {
  const ref    = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [totalClicks, setTotalClicks] = useState(0);
  const [showSecret, setShowSecret]   = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (totalClicks >= FLOWERS.length && !showSecret) {
      setTimeout(() => setShowSecret(true), 500);
    }
  }, [totalClicks, showSecret]);

  return (
    <section ref={ref} className="relative py-20 sm:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FAF0E6 30%, #F5E6D3 60%, #FAF0E6 85%, #FFF8F0 100%)', minHeight: '75vh' }}>

      {/* Subtle paper texture */}
      <div className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(26,22,20,0.005) 1px, transparent 1px)', backgroundSize: '3px 3px' }} />

      {/* Ambient warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full h-full">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(212,165,116,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }}
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      {/* Butterflies */}
      <Butterfly x={8}  y={20} />
      <Butterfly x={75} y={40} />
      <Butterfly x={45} y={80} />

      {/* Heading */}
      <motion.div className="text-center mb-12 sm:mb-16 px-6 relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
        <p className="font-serif tracking-[0.3em] uppercase mb-3"
          style={{ color: 'rgba(212,165,116,0.6)', fontSize: 'clamp(0.55rem, 0.9vw, 0.65rem)' }}>
          taman kenangan
        </p>
        <h2 className="font-serif tracking-tight mb-3"
          style={{ color: '#1A1614', fontWeight: 300, fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)', lineHeight: 1.2 }}>
          Mekar Untukmu
        </h2>
        <p className="font-serif italic"
          style={{ color: 'rgba(212,165,116,0.55)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>
          hover untuk mekar, klik untuk menemukan pesan tersembunyi
        </p>
        <div className="mx-auto mt-5 h-px w-14 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.4), transparent)' }} />

        {/* Click progress */}
        <div className="mt-4 flex justify-center gap-1.5">
          {FLOWERS.map((f, i) => (
            <motion.div key={f.id} className="rounded-full"
              style={{ width: 6, height: 6, background: totalClicks > i ? '#D4A574' : 'rgba(212,165,116,0.15)', boxShadow: totalClicks > i ? '0 0 6px rgba(212,165,116,0.5)' : 'none' }}
              animate={totalClicks > i ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }} />
          ))}
        </div>
        <p className="mt-2 font-serif" style={{ color: 'rgba(212,165,116,0.45)', fontSize: '0.6rem', letterSpacing: '0.15em' }}>
          {totalClicks} / {FLOWERS.length} ditemukan
        </p>
      </motion.div>

      {/* Garden area */}
      <div className="relative max-w-6xl mx-auto px-4" style={{ minHeight: '50vh' }}>
        {/* Floating ambient particles */}
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.div key={i} className="absolute pointer-events-none rounded-full"
            style={{
              width: 1.5 + Math.random() * 3, height: 1.5 + Math.random() * 3,
              background: i % 2 === 0 ? '#D4A574' : '#E8C4C4',
              left: `${5 + Math.random() * 90}%`, top: `${5 + Math.random() * 90}%`,
              opacity: 0.04 + Math.random() * 0.08,
            }}
            animate={{ y: [0, -(12 + Math.random() * 18)], opacity: [0.04, 0.14, 0.04] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }} />
        ))}

        {/* Flowers */}
        {FLOWERS.map((f, i) => (
          <GardenFlower key={f.id} flower={f} index={i} />
        ))}
      </div>

      {/* Secret message after all found */}
      <AnimatePresence>
        {showSecret && (
          <motion.div className="relative z-20 text-center mt-16 px-8"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.5))' }} />
              <span style={{ color: '#D4A574', fontSize: '1.2rem' }}>✿</span>
              <div className="h-px w-12" style={{ background: 'linear-gradient(270deg, transparent, rgba(212,165,116,0.5))' }} />
            </div>
            <p className="font-serif italic" style={{ color: 'rgba(26,22,20,0.6)', fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)', fontWeight: 300 }}>
              Kamu sudah menemukan semua bunga.<br />
              Sama seperti taman ini, kamu selalu penuh kejutan yang indah.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FFF8F0, transparent)' }} />
    </section>
  );
}
