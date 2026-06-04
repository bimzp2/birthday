'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const DARK  = '#0A0908';
const GOLD  = '#D4A574';
const IVORY = '#FFF8F0';
const ROSE  = '#E8C4C4';
const CHAMPAGNE = '#F5E6D3';

/* ── Audio helpers ──────────────────────────────────── */
function useAudioCtx() {
  const ref = useRef<AudioContext | null>(null);
  const get = () => {
    if (!ref.current) ref.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ref.current.state === 'suspended') ref.current.resume();
    return ref.current;
  };
  return get;
}

function playMagicalBlow(getCtx: () => AudioContext) {
  try {
    const ctx = getCtx();
    const t   = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = buf;
    const filt  = ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.setValueAtTime(3000, t); filt.frequency.exponentialRampToValueAtTime(80, t + 1.2);
    const gain  = ctx.createGain(); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.4, t + 0.08); gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
    noise.connect(filt); filt.connect(gain); gain.connect(ctx.destination); noise.start();
    // Chime
    [800, 1200, 1600, 2000].forEach((freq, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t + i * 0.07); g.gain.linearRampToValueAtTime(0.15, t + i * 0.07 + 0.04); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 1.8);
      o.connect(g); g.connect(ctx.destination); o.start(t + i * 0.07); o.stop(t + i * 0.07 + 2);
    });
  } catch {}
}

function playHoverTick(getCtx: () => AudioContext) {
  try {
    const ctx = getCtx();
    const o   = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 880;
    const g   = ctx.createGain(); g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.15);
  } catch {}
}

/* ── Candle flame component ─────────────────────────── */
function CandleFlame({ blown, small = false }: { blown: boolean; small?: boolean }) {
  const s = small ? 0.65 : 1;
  return (
    <AnimatePresence>
      {!blown && (
        <motion.div style={{ transformOrigin: 'bottom center', scale: s }}
          exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.15 } }}>
          {/* Outer flame */}
          <motion.div className="relative"
            animate={{ scaleY: [1, 1.18, 0.88, 1.12, 1], scaleX: [1, 0.88, 1.08, 0.92, 1], rotate: [-4, 5, -3, 4, -4] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}>
            <div style={{
              width: 14, height: 24,
              borderRadius: '50% 50% 30% 30% / 65% 65% 35% 35%',
              background: 'linear-gradient(to top, #FF3800 0%, #FF8C00 35%, #FFD700 70%, rgba(255,255,220,0.6) 100%)',
              boxShadow: '0 0 12px #FF6600, 0 0 24px #FF880060, 0 0 40px #FFB30030',
            }} />
            {/* Inner white core */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2" style={{
              width: 5, height: 10,
              borderRadius: '50% 50% 30% 30% / 65% 65% 35% 35%',
              background: 'rgba(255,255,255,0.9)',
              filter: 'blur(1px)',
            }} />
          </motion.div>
          {/* Glow ring */}
          <motion.div className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,160,0,0.25) 0%, transparent 70%)', width: 40, height: 40, top: -10, left: -13, filter: 'blur(6px)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Single candle ──────────────────────────────────── */
function Candle({ blown, color, offsetX = 0, small = false }: { blown: boolean; color: string; offsetX?: number; small?: boolean }) {
  return (
    <div className="relative flex flex-col items-center" style={{ marginLeft: offsetX, zIndex: 5 }}>
      <div className="relative" style={{ marginBottom: -2 }}>
        <CandleFlame blown={blown} small={small} />
        {/* Smoke */}
        <AnimatePresence>
          {blown && (
            <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none"
              initial={{ opacity: 0, y: 0, scaleX: 1 }}
              animate={{ opacity: [0, 0.5, 0.3, 0], y: -50, scaleX: [1, 1.4, 1.8, 2.2], scaleY: [1, 0.9, 0.7, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="absolute rounded-full"
                  style={{ width: 8 + i * 4, height: 8 + i * 4, background: 'radial-gradient(circle, rgba(140,140,140,0.3) 0%, transparent 70%)', filter: 'blur(3px)', left: -i * 4, top: i * 6 }}
                  animate={{ x: [(i - 1) * 6, (i - 1) * -6], rotate: [0, 30 - i * 20] }}
                  transition={{ duration: 2.5 - i * 0.3, ease: 'easeOut' }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Candle body */}
      <div style={{ width: small ? 8 : 11, height: small ? 30 : 42, borderRadius: '2px 2px 1px 1px',
        background: `linear-gradient(to right, rgba(255,255,255,0.4) 0%, ${color} 40%, rgba(0,0,0,0.1) 100%)`,
        boxShadow: blown ? 'none' : `0 0 8px ${color}60`,
        position: 'relative', overflow: 'hidden' }}>
        {/* Stripe */}
        <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: '18%', background: 'rgba(255,255,255,0.15)', transform: 'skewY(-10deg)' }} />
        {/* Wax drip */}
        {!blown && <div style={{ position: 'absolute', top: -2, left: 1, width: 3, height: 6, background: color, borderRadius: '0 0 3px 3px', opacity: 0.7 }} />}
      </div>
    </div>
  );
}

/* ── Confetti piece ─────────────────────────────────── */
function ConfettiPiece({ i, total }: { i: number; total: number }) {
  const angle   = (i / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
  const dist    = 80 + Math.random() * 160;
  const colors  = [GOLD, ROSE, CHAMPAGNE, IVORY, '#FFD700', '#FF88A0', '#A0D8FF'];
  const color   = colors[i % colors.length];
  const isCircle = i % 3 === 0;
  return (
    <motion.div className="absolute pointer-events-none"
      style={{
        top: '30%', left: '50%',
        width: isCircle ? 6 : 5 + Math.random() * 5,
        height: isCircle ? 6 : 9 + Math.random() * 6,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : '2px',
        boxShadow: `0 0 6px ${color}80`,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
      animate={{
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + 60,
        opacity: [1, 1, 0],
        scale: [0, 1, 0.6],
        rotate: [0, Math.random() * 720 - 360],
      }}
      transition={{ duration: 1.8 + Math.random() * 0.8, ease: [0.2, 0, 0.8, 1], delay: i * 0.02 }}
    />
  );
}

/* ── Main component ─────────────────────────────────── */
export default function InteractiveCake() {
  const [blown, setBlown]       = useState(false);
  const [showMsg, setShowMsg]   = useState(false);
  const [glowing, setGlowing]   = useState(false);
  const [hovered, setHovered]   = useState(false);
  const getCtx = useAudioCtx();

  const handleBlow = useCallback(() => {
    if (blown) return;
    setBlown(true);
    playMagicalBlow(getCtx);
    setTimeout(() => { setShowMsg(true); setGlowing(true); }, 800);
  }, [blown, getCtx]);

  // 3D tilt
  const cX = useMotionValue(0), cY = useMotionValue(0);
  const rX  = useTransform(cY, [-200, 200], [10, -10]);
  const rY  = useTransform(cX, [-200, 200], [-10, 10]);

  const handleCakeMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    cX.set(e.clientX - r.left - r.width / 2);
    cY.set(e.clientY - r.top - r.height / 2);
  };

  return (
    <section className="relative py-28 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${DARK} 0%, #1A1510 50%, ${DARK} 100%)`, minHeight: '90vh' }}>

      {/* Ambient glows */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 'clamp(300px, 50vw, 600px)', height: 'clamp(300px, 50vw, 600px)', top: '10%', left: '50%', transform: 'translateX(-50%)', background: `radial-gradient(circle, ${blown ? GOLD : 'rgba(255,120,0)'}${blown ? '08' : '10'} 0%, transparent 70%)`, filter: 'blur(60px)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{ width: 2 + Math.random() * 4, height: 2 + Math.random() * 4, left: `${5 + Math.random() * 90}%`, background: i % 2 === 0 ? GOLD : ROSE, opacity: 0.05 + Math.random() * 0.1 }}
          animate={{ y: [0, -(40 + Math.random() * 60)], opacity: [0.08, 0, 0.08], x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20] }}
          transition={{ duration: 5 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 6, ease: 'easeInOut' }} />
      ))}

      {/* Heading */}
      <motion.div className="text-center mb-14 z-10 px-6"
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
        <p className="font-serif tracking-[0.3em] uppercase mb-3"
          style={{ color: `${GOLD}70`, fontSize: 'clamp(0.6rem, 1vw, 0.7rem)' }}>
          untukmu
        </p>
        <h2 className="font-serif tracking-tight mb-2"
          style={{ color: IVORY, fontWeight: 300, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', lineHeight: 1.15 }}>
          Waktunya Tiup Lilin
        </h2>
        <motion.p className="font-serif italic"
          style={{ color: `rgba(212,165,116,0.75)`, fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)' }}
          key={blown ? 'blown' : 'not'}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {blown ? 'Harapanmu sudah didengar semesta.' : 'Tutup mata, buat harapan, lalu ketuk lilinnya...'}
        </motion.p>
      </motion.div>

      {/* Cake scene */}
      <motion.div
        className="relative cursor-pointer z-10"
        style={{ perspective: 1200, width: 'min(90vw, 360px)' }}
        onMouseMove={handleCakeMove}
        onMouseLeave={() => { cX.set(0); cY.set(0); setHovered(false); }}
        onMouseEnter={() => { setHovered(true); playHoverTick(getCtx); }}
        onClick={handleBlow}
      >
        <motion.div style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }}
          animate={hovered && !blown ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}>

          <div className="relative flex flex-col items-center" style={{ height: 340 }}>

            {/* Plate glow */}
            {!blown && (
              <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                style={{ width: 240, height: 30, background: `radial-gradient(ellipse, rgba(255,140,0,0.2) 0%, transparent 70%)`, filter: 'blur(10px)' }}
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
            )}

            {/* Candles */}
            <div className="absolute flex items-end gap-2" style={{ bottom: 138, zIndex: 10 }}>
              <Candle blown={blown} color="#FF88A0" small />
              <Candle blown={blown} color="#A8D8FF" small />
              <Candle blown={blown} color={GOLD} />
              <Candle blown={blown} color="#FFD700" small />
              <Candle blown={blown} color="#C8A0FF" small />
            </div>

            {/* Confetti */}
            <AnimatePresence>
              {blown && Array.from({ length: 40 }).map((_, i) => <ConfettiPiece key={i} i={i} total={40} />)}
            </AnimatePresence>

            {/* Top tier */}
            <div className="absolute" style={{ bottom: 130, left: '50%', transform: 'translateX(-50%)', width: 150, height: 68 }}>
              {/* Top surface */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: '#FFFDF9', borderRadius: '75px 75px 10px 10px', boxShadow: glowing ? `0 0 30px ${GOLD}50` : 'none', transition: 'box-shadow 1s' }} />
              {/* Body */}
              <div style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 0, borderRadius: 12, background: 'linear-gradient(to right, #F0DEC8, #FAF0E6, #F5E6D3)', overflow: 'hidden' }}>
                {/* Decoration dots */}
                {[15, 35, 55, 75, 95].map(x => (
                  <div key={x} style={{ position: 'absolute', top: '30%', left: `${x}%`, width: 5, height: 5, background: ROSE, borderRadius: '50%', opacity: 0.7 }} />
                ))}
              </div>
              {/* Frosting drips */}
              <svg className="absolute -top-1 left-0 w-full" viewBox="0 0 150 16" fill="#FFFDF9" style={{ filter: glowing ? `drop-shadow(0 0 8px ${GOLD}40)` : 'none' }}>
                <path d="M0,0 Q8,12 16,4 Q24,16 32,6 Q40,14 48,4 Q56,16 64,6 Q72,12 80,3 Q88,14 96,5 Q104,14 112,4 Q120,12 128,3 Q136,14 144,5 Q148,10 150,0 Z" />
              </svg>
            </div>

            {/* Bottom tier */}
            <div className="absolute" style={{ bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 210, height: 115 }}>
              {/* Surface */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 18, background: '#FFFDF9', borderRadius: '105px 105px 12px 12px' }} />
              {/* Body */}
              <div style={{ position: 'absolute', top: 10, left: 0, right: 0, bottom: 0, borderRadius: 14, background: 'linear-gradient(to right, #EDD5B8, #F5E6D3, #EDD5B8)', overflow: 'hidden' }}>
                {/* Decorative stripe */}
                <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, height: 2, background: `${GOLD}30` }} />
                <div style={{ position: 'absolute', top: '55%', left: 0, right: 0, height: 2, background: `${GOLD}20` }} />
                {/* Floral pattern */}
                {[20, 50, 80].map(x => (
                  <div key={x} style={{ position: 'absolute', top: '35%', left: `${x}%`, width: 12, height: 12, borderRadius: '50%', border: `1px solid ${GOLD}25`, background: `${ROSE}15` }} />
                ))}
              </div>
              {/* Frosting drips */}
              <svg className="absolute -top-1 left-0 w-full" viewBox="0 0 210 20" fill="#FFFDF9" style={{ filter: glowing ? `drop-shadow(0 0 10px ${GOLD}40)` : 'none' }}>
                <path d="M0,0 Q10,14 20,5 Q30,18 40,7 Q50,16 60,5 Q70,14 80,4 Q90,18 100,8 Q110,16 120,5 Q130,14 140,4 Q150,18 160,7 Q170,14 180,5 Q190,16 200,6 Q206,12 210,0 Z" />
              </svg>
              {/* Plate */}
              <div style={{ position: 'absolute', bottom: -6, left: -8, right: -8, height: 10, background: 'linear-gradient(to bottom, #E8D5C0, #D4BFA5)', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
            </div>

            {/* Glow on blown */}
            <AnimatePresence>
              {glowing && (
                <motion.div className="absolute inset-0 rounded-3xl pointer-events-none"
                  initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0.3] }} exit={{ opacity: 0 }}
                  style={{ background: `radial-gradient(ellipse at center 60%, ${GOLD}20 0%, transparent 70%)`, filter: 'blur(20px)' }} />
              )}
            </AnimatePresence>

            {/* Click hint */}
            <AnimatePresence>
              {!blown && hovered && (
                <motion.div className="absolute pointer-events-none z-20"
                  style={{ bottom: 160, left: '50%', transform: 'translateX(-50%)' }}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <p className="font-serif italic" style={{ color: `${GOLD}90`, fontSize: '0.7rem', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
                    klik untuk tiup ✨
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Message after blow */}
      <AnimatePresence>
        {showMsg && (
          <motion.div className="mt-14 text-center px-8 z-10 max-w-md"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px flex-grow" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40)` }} />
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 1 L11.5 8 L18 10 L11.5 12 L10 19 L8.5 12 L2 10 L8.5 8Z" fill={GOLD} opacity="0.6" /></svg>
              <div className="h-px flex-grow" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}40)` }} />
            </div>
            <p className="font-serif leading-relaxed"
              style={{ color: `${CHAMPAGNE}CC`, fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', fontWeight: 300, lineHeight: 1.75 }}>
              Semua harapanmu sudah diterbangkan ke semesta. Semoga semuanya jadi nyata, satu per satu, perlahan tapi pasti.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
