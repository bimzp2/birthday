'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GOLD       = '#D4A574';
const IVORY      = '#FFF8F0';
const ROSE       = '#E8C4C4';
const CHAMPAGNE  = '#F5E6D3';

interface Star { id: number; x: number; y: number; group: number; label?: string }
interface Constellation { id: number; name: string; wish: string; stars: number[]; color: string }

const STARS: Star[] = [
  { id: 0,  x: 15, y: 28, group: 0 },
  { id: 1,  x: 22, y: 18, group: 0 },
  { id: 2,  x: 30, y: 28, group: 0 },
  { id: 3,  x: 22, y: 38, group: 0 },
  { id: 4,  x: 22, y: 30, group: 0 },

  { id: 5,  x: 52, y: 22, group: 1 },
  { id: 6,  x: 60, y: 14, group: 1 },
  { id: 7,  x: 68, y: 22, group: 1 },
  { id: 8,  x: 60, y: 32, group: 1 },

  { id: 9,  x: 38, y: 55, group: 2 },
  { id: 10, x: 47, y: 47, group: 2 },
  { id: 11, x: 56, y: 55, group: 2 },
  { id: 12, x: 52, y: 65, group: 2 },
  { id: 13, x: 42, y: 65, group: 2 },

  { id: 14, x: 78, y: 48, group: 3 },
  { id: 15, x: 84, y: 38, group: 3 },
  { id: 16, x: 88, y: 50, group: 3 },
  { id: 17, x: 82, y: 60, group: 3 },
];

const CONSTELLATIONS: Constellation[] = [
  {
    id: 0, name: 'Hati', color: '#E89AAE',
    stars: [0, 1, 2, 3, 4],
    wish: 'Semoga kamu selalu dikelilingi orang-orang yang tulus dan hadir untukmu.',
  },
  {
    id: 1, name: 'Bintang', color: GOLD,
    stars: [5, 6, 7, 8],
    wish: 'Semoga di saat kamu ngerasa gelap, selalu ada cahaya yang membimbing langkahmu.',
  },
  {
    id: 2, name: 'Mimpi', color: '#8ABADC',
    stars: [9, 10, 11, 12, 13],
    wish: 'Semoga semua hal baik yang lagi kamu usahain sekarang bisa terwujud satu per satu.',
  },
  {
    id: 3, name: 'Bulan', color: '#C4A8E8',
    stars: [14, 15, 16, 17],
    wish: 'Semoga kamu selalu punya ketenangan seperti malam yang tenang, dan selalu bisa pulang.',
  },
];

export default function ConstellationWishes() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected]   = useState<number | null>(null);
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [revealed, setRevealed]   = useState<Set<number>>(new Set());
  const [hovered, setHovered]     = useState<number | null>(null);
  const [inView, setInView]       = useState(false);
  const [burstAt, setBurstAt]     = useState<{ x: number; y: number; color: string } | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.12 });
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Canvas star field ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const p = canvas.parentElement;
      if (p) { canvas.width = p.offsetWidth; canvas.height = p.offsetHeight; }
    };
    resize();
    window.addEventListener('resize', resize);

    const bgStars = Array.from({ length: 260 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.3 + Math.random() * 1.7,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.8,
      base: 0.05 + Math.random() * 0.44,
      gold: Math.random() > 0.8,
    }));

    let t = 0, id: number;
    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of bgStars) {
        const a = s.base * (0.45 + 0.55 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? `rgba(212,165,116,${a})` : `rgba(245,230,211,${a})`;
        ctx.fill();
        // Cross on bright large stars
        if (s.r > 1.3 && a > 0.28) {
          const px = s.x * canvas.width, py = s.y * canvas.height;
          ctx.strokeStyle = s.gold ? `rgba(212,165,116,${a * 0.4})` : `rgba(245,230,211,${a * 0.35})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath(); ctx.moveTo(px - s.r * 2.8, py); ctx.lineTo(px + s.r * 2.8, py); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px, py - s.r * 2.8); ctx.lineTo(px, py + s.r * 2.8); ctx.stroke();
        }
      }
      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  const handleStar = useCallback((starId: number, elem: HTMLButtonElement | null) => {
    if (selected === null) {
      setSelected(starId);
    } else if (selected === starId) {
      setSelected(null);
    } else {
      const key = [Math.min(selected, starId), Math.max(selected, starId)].join('-');
      if (!connections.has(key)) {
        const next = new Set(connections); next.add(key);
        setConnections(next);

        if (elem) {
          const r = elem.getBoundingClientRect();
          const c = CONSTELLATIONS.find(cc => cc.stars.includes(starId))?.color || GOLD;
          setBurstAt({ x: r.left + r.width / 2, y: r.top + r.height / 2, color: c });
          setTimeout(() => setBurstAt(null), 1100);
        }

        for (const c of CONSTELLATIONS) {
          if (revealed.has(c.id)) continue;
          let cnt = 0;
          for (const conn of next) {
            const [a, b] = conn.split('-').map(Number);
            if (c.stars.includes(a) && c.stars.includes(b)) cnt++;
          }
          if (cnt >= c.stars.length - 1) {
            setRevealed(prev => new Set([...prev, c.id]));
          }
        }
      }
      setSelected(null);
    }
  }, [selected, connections, revealed]);

  const allDone = revealed.size === CONSTELLATIONS.length;

  return (
    <section ref={sectionRef} className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0908 0%, #0f0c14 25%, #13101c 50%, #0f0c14 75%, #0A0908 100%)',
        minHeight: '90vh',
        padding: 'clamp(4rem, 7vw, 8rem) 0',
      }}>

      <div className="absolute inset-0">
        <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
      </div>

      {/* Nebula glows */}
      {[
        { l: '5%',  t: '8%',  c: 'rgba(100,60,200,0.04)' },
        { l: '62%', t: '28%', c: 'rgba(212,165,116,0.04)' },
        { l: '18%', t: '62%', c: 'rgba(80,140,220,0.03)' },
        { l: '76%', t: '68%', c: 'rgba(200,80,160,0.03)' },
      ].map((g, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{ left: g.l, top: g.t, width: 'clamp(200px, 36vw, 420px)', height: 'clamp(200px, 36vw, 420px)',
            background: `radial-gradient(circle, ${g.c} 0%, transparent 70%)`, filter: 'blur(55px)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 11 + i * 3, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }} />
      ))}

      {/* Header */}
      <motion.div className="text-center mb-12 sm:mb-16 px-6 relative z-10"
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>

        <p className="font-serif tracking-[0.32em] uppercase mb-4"
          style={{ color: `${GOLD}58`, fontSize: 'clamp(0.52rem, 0.88vw, 0.64rem)' }}>
          bintang-bintang berbisik
        </p>
        <h2 className="font-serif tracking-tight mb-4"
          style={{ color: IVORY, fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', lineHeight: 1.18 }}>
          Harapan yang Tertulis di Langit
        </h2>
        <p className="font-serif italic"
          style={{ color: 'rgba(245,230,211,0.32)', fontSize: 'clamp(0.72rem, 1.15vw, 0.88rem)' }}>
          hubungkan bintang-bintang untuk mengungkap harapan tersembunyi
        </p>
        <div className="mx-auto mt-5 h-px w-12 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}32, transparent)` }} />

        {/* Progress pips */}
        <div className="flex justify-center gap-2.5 mt-5">
          {CONSTELLATIONS.map(c => (
            <motion.div key={c.id} className="w-1.5 h-1.5 rounded-full"
              style={{ background: revealed.has(c.id) ? c.color : 'rgba(255,255,255,0.08)', boxShadow: revealed.has(c.id) ? `0 0 7px ${c.color}` : 'none' }}
              animate={revealed.has(c.id) ? { scale: [1, 1.5, 1] } : { scale: 1 }}
              transition={{ duration: 0.5 }} />
          ))}
        </div>
        <p className="mt-2 font-serif" style={{ color: `${GOLD}42`, fontSize: '0.58rem', letterSpacing: '0.2em' }}>
          {revealed.size} dari {CONSTELLATIONS.length}
        </p>
      </motion.div>

      {/* Star field */}
      <div className="relative max-w-4xl mx-auto px-4 z-10" style={{ minHeight: '50vh' }}>

        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5, overflow: 'visible' }}>
          <defs>
            {CONSTELLATIONS.map(c => (
              <filter key={c.id} id={`glow-${c.id}`}>
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>
          {Array.from(connections).map(key => {
            const [aId, bId] = key.split('-').map(Number);
            const a = STARS.find(s => s.id === aId);
            const b = STARS.find(s => s.id === bId);
            if (!a || !b) return null;
            const c = CONSTELLATIONS.find(cc => cc.stars.includes(aId));
            const isRev = c && revealed.has(c.id);
            return (
              <motion.line key={key}
                x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
                stroke={c?.color || GOLD}
                strokeWidth={isRev ? 1.2 : 0.8}
                opacity={isRev ? 0.65 : 0.32}
                filter={isRev ? `url(#glow-${c?.id})` : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isRev ? 0.65 : 0.32 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}
        </svg>

        {/* Stars */}
        {STARS.map(star => {
          const isSel = selected === star.id;
          const isRev = revealed.has(star.group);
          const isHov = hovered === star.id;
          const c     = CONSTELLATIONS[star.group];
          const color = c?.color || GOLD;

          return (
            <motion.button key={star.id}
              className="absolute z-10 cursor-pointer"
              style={{ left: `${star.x}%`, top: `${star.y}%`, transform: 'translate(-50%,-50%)' }}
              onClick={e => handleStar(star.id, e.currentTarget)}
              onMouseEnter={() => setHovered(star.id)}
              onMouseLeave={() => setHovered(null)}
              whileTap={{ scale: 0.82 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: star.id * 0.055 + 0.3, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}>

              <div className="relative flex items-center justify-center" style={{ width: 34, height: 34 }}>
                {/* Outer glow */}
                <motion.div className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${color}${isRev ? '48' : isSel ? '3C' : '1A'} 0%, transparent 70%)`, filter: 'blur(4px)' }}
                  animate={isSel || isHov ? { scale: 1.6 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320 }} />

                {/* Core */}
                <motion.div className="relative rounded-full"
                  style={{
                    width: 7, height: 7,
                    background: isRev ? color : isSel ? IVORY : 'rgba(245,230,211,0.75)',
                    boxShadow: `0 0 ${isSel || isHov ? 18 : isRev ? 12 : 5}px ${color}`,
                  }}
                  animate={isRev ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: star.id * 0.1 }} />

                {/* Pulse when selected */}
                {isSel && (
                  <motion.div className="absolute inset-0 rounded-full border"
                    style={{ borderColor: `${color}55` }}
                    animate={{ scale: [1, 2.4], opacity: [0.65, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }} />
                )}
              </div>
            </motion.button>
          );
        })}

        {/* Revealed wish cards */}
        <AnimatePresence>
          {Array.from(revealed).map(cId => {
            const c = CONSTELLATIONS.find(cc => cc.id === cId);
            if (!c) return null;
            const groupStars = STARS.filter(s => c.stars.includes(s.id));
            const avgX = groupStars.reduce((s, st) => s + st.x, 0) / groupStars.length;
            const avgY = groupStars.reduce((s, st) => s + st.y, 0) / groupStars.length + 14;
            return (
              <motion.div key={cId}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${avgX}%`, top: `${avgY}%`,
                  transform: 'translateX(-50%)',
                  maxWidth: 210,
                }}
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
                <div className="px-5 py-4 rounded-2xl text-center"
                  style={{
                    background: 'rgba(10,9,8,0.78)',
                    backdropFilter: 'blur(18px)',
                    border: `1px solid ${c.color}28`,
                    boxShadow: `0 4px 28px rgba(0,0,0,0.38), 0 0 18px ${c.color}12`,
                  }}>
                  <p className="font-serif mb-2 uppercase"
                    style={{ color: c.color, fontSize: 'clamp(0.52rem, 0.82vw, 0.62rem)', letterSpacing: '0.2em' }}>
                    {c.name}
                  </p>
                  <div className="mb-2 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.color}35, transparent)` }} />
                  <p className="font-serif italic leading-relaxed"
                    style={{ color: `${IVORY}CC`, fontSize: 'clamp(0.7rem, 1.1vw, 0.82rem)', lineHeight: 1.6 }}>
                    {c.wish}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* First-use hint */}
        <AnimatePresence>
          {connections.size === 0 && inView && selected === null && (
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 1.8 }}>
              <p className="font-serif italic text-center"
                style={{ color: `${GOLD}38`, fontSize: 'clamp(0.68rem, 1.15vw, 0.82rem)' }}>
                Ketuk sebuah bintang, lalu bintang lainnya
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Burst */}
      <AnimatePresence>
        {burstAt && Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const dist  = 28 + Math.random() * 48;
          return (
            <motion.div key={i} className="fixed pointer-events-none rounded-full z-50"
              style={{ width: 3, height: 3, background: burstAt.color, boxShadow: `0 0 5px ${burstAt.color}`, left: burstAt.x - 1.5, top: burstAt.y - 1.5 }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1 }}
              transition={{ duration: 0.85, ease: 'easeOut', delay: i * 0.02 }} />
          );
        })}
      </AnimatePresence>

      {/* All done */}
      <AnimatePresence>
        {allDone && (
          <motion.div className="relative z-20 text-center mt-14 px-6"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-center gap-5 mb-4">
              <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}35)` }} />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1 L9 7 L15 8 L9 9 L8 15 L7 9 L1 8 L7 7 Z" fill={GOLD} opacity="0.5" />
              </svg>
              <div className="h-px w-10" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}35)` }} />
            </div>
            <motion.p className="font-serif"
              style={{ color: GOLD, fontSize: 'clamp(1rem, 2.2vw, 1.45rem)', fontWeight: 300 }}
              animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity }}>
              Semua harapan sudah kamu temukan
            </motion.p>
            <p className="font-serif italic mt-3" style={{ color: `${CHAMPAGNE}60`, fontSize: 'clamp(0.78rem, 1.3vw, 0.95rem)' }}>
              semoga langit menjagamu
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
