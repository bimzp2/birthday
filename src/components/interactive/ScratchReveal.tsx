'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const GOLD       = '#D4A574';
const IVORY      = '#FFF8F0';
const ROSE       = '#E8C4C4';
const CHAMPAGNE  = '#F5E6D3';
const DARK       = '#0A0908';

const HIDDEN_MESSAGE = {
  headline: 'Kamu adalah kejutan\nterbaik dalam hidupku',
  body: 'Dulu aku nggak pernah tahu kalau aku akan bertemu seseorang yang bisa membuat dunia jadi seindah ini. Makasih ya, Asa.',
  tag: '— hanya untukmu',
};

/* ── Scratch particle ── */
interface ScratchParticleData { id: number; x: number; y: number; color: string }

function ScratchParticle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div className="fixed pointer-events-none rounded-full z-[9999]"
      style={{ width: 4, height: 4, background: color, boxShadow: `0 0 5px ${color}`, left: x - 2, top: y - 2 }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{ y: -28, opacity: 0, scale: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }} />
  );
}

export default function ScratchReveal() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed]   = useState(false);
  const [scratchPct, setScratchPct]   = useState(0);
  const [particles, setParticles]     = useState<ScratchParticleData[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const isDrawing    = useRef(false);
  const pidRef       = useRef(0);
  const scratchedRef = useRef(0);
  const totalRef     = useRef(1);

  const spawnParticle = useCallback((x: number, y: number) => {
    const colors = [GOLD, CHAMPAGNE, ROSE, '#FFD0A0'];
    const p: ScratchParticleData = { id: pidRef.current++, x, y, color: colors[Math.floor(Math.random() * colors.length)] };
    setParticles(prev => [...prev, p]);
    setTimeout(() => setParticles(prev => prev.filter(pp => pp.id !== p.id)), 850);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    totalRef.current = rect.width * rect.height;

    // Base gradient
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#2A1F1A');
    grad.addColorStop(0.45, '#1A120E');
    grad.addColorStop(0.75, '#0F0C10');
    grad.addColorStop(1, '#0A0908');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Gold dust texture
    for (let i = 0; i < 3800; i++) {
      const gx = Math.random() * rect.width;
      const gy = Math.random() * rect.height;
      ctx.fillStyle = `rgba(${i % 3 === 0 ? '212,165,116' : '255,248,240'},${Math.random() * 0.1})`;
      ctx.fillRect(gx, gy, Math.random() > 0.5 ? 2 : 1, 1);
    }

    // Hint text
    ctx.save();
    ctx.font = `300 ${Math.min(rect.width * 0.048, 20)}px 'Cormorant Garamond', serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(212,165,116,0.3)';
    ctx.fillText('Gosok perlahan untuk mengungkap', rect.width / 2, rect.height / 2 - 10);
    ctx.fillStyle = 'rgba(255,248,240,0.12)';
    ctx.font = `300 ${Math.min(rect.width * 0.03, 12)}px 'Cormorant Garamond', serif`;
    ctx.fillText('ada sesuatu di baliknya', rect.width / 2, rect.height / 2 + 22);
    ctx.restore();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap  = 'round';
    ctx.lineWidth = Math.max(rect.width * 0.1, 44);

    const getPos = (e: MouseEvent | TouchEvent) => {
      const r  = canvas.getBoundingClientRect();
      const cx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const cy = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
      return { x: cx - r.left, y: cy - r.top };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();

      scratchedRef.current += ctx.lineWidth * 12;
      const pct = Math.min(100, (scratchedRef.current / totalRef.current) * 100);
      setScratchPct(pct);

      if (Math.random() > 0.58) {
        const abs = canvas.getBoundingClientRect();
        spawnParticle(abs.left + x, abs.top + y);
      }

      if (pct >= 38 && !isRevealed) {
        setIsRevealed(true);
        setCelebrating(true);
        canvas.style.transition = 'opacity 2.8s ease-in-out';
        canvas.style.opacity = '0';
        setTimeout(() => { canvas.style.display = 'none'; setCelebrating(false); }, 2900);
      }
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDrawing.current = true;
      setHintVisible(false);
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    const onUp = () => { isDrawing.current = false; };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', scratch);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onDown);
      canvas.removeEventListener('touchmove', scratch);
      window.removeEventListener('touchend', onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3D tilt
  const tiltX = useMotionValue(0), tiltY = useMotionValue(0);
  const rotX  = useTransform(tiltY, [-300, 300], [7, -7]);
  const rotY  = useTransform(tiltX, [-300, 300], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    tiltX.set(e.clientX - rect.left - rect.width / 2);
    tiltY.set(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => { tiltX.set(0); tiltY.set(0); };

  return (
    <section className="relative flex flex-col items-center justify-center py-32 sm:py-44 overflow-hidden"
      style={{ background: `linear-gradient(160deg, #120F0E 0%, ${DARK} 48%, #1a1510 100%)`, minHeight: '85vh' }}>

      {/* Ambient sparks */}
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{
            width: 1.5 + Math.random() * 2.5, height: 1.5 + Math.random() * 2.5,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? GOLD : i % 3 === 1 ? ROSE : IVORY,
            opacity: 0.04 + Math.random() * 0.12,
          }}
          animate={{ opacity: [0.04, 0.28, 0.04], scale: [0.7, 1.4, 0.7] }}
          transition={{ duration: 2.5 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4, ease: 'easeInOut' }}
        />
      ))}

      {/* Section header */}
      <motion.div className="text-center mb-16 px-6 z-10"
        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
        <p className="font-serif tracking-[0.32em] uppercase mb-5"
          style={{ color: `${GOLD}65`, fontSize: 'clamp(0.55rem, 0.9vw, 0.65rem)' }}>
          kenangan tersembunyi
        </p>
        <h2 className="font-serif tracking-tight mb-4"
          style={{ color: IVORY, fontWeight: 300, fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', lineHeight: 1.15 }}>
          Ada Sesuatu Untukmu
        </h2>
        <p className="font-serif italic"
          style={{ color: `${GOLD}75`, fontSize: 'clamp(0.85rem, 1.4vw, 1rem)' }}>
          sesuatu yang spesial ada di baliknya
        </p>
        <div className="mx-auto mt-5 h-px w-12"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}38, transparent)` }} />
      </motion.div>

      {/* Progress */}
      <AnimatePresence>
        {!isRevealed && scratchPct > 2 && (
          <motion.div className="mb-8 z-10 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-36 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${GOLD}80, ${GOLD})` }}
                initial={{ width: 0 }} animate={{ width: `${scratchPct}%` }} transition={{ ease: 'easeOut' }} />
            </div>
            <p className="font-serif" style={{ color: `${GOLD}45`, fontSize: '0.55rem', letterSpacing: '0.18em' }}>
              {Math.round(scratchPct)}% tergosok
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <motion.div ref={containerRef} className="relative rounded-xl overflow-hidden cursor-crosshair z-10 mx-6 w-full"
        onMouseMove={handleMouseMove} onMouseLeave={onLeave}
        style={{
          width: 'min(88vw, 380px)',
          minHeight: 320,
          aspectRatio: '3/4',
          rotateX: rotX, rotateY: rotY,
          transformStyle: 'preserve-3d', perspective: 1200,
          boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 50px rgba(212,165,116,0.07)',
          border: '1px solid rgba(212,165,116,0.1)',
        }}
        whileHover={{ scale: 1.012 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}>

        {/* Hidden content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10"
          style={{ background: 'linear-gradient(145deg, #1A1510 0%, #0A0908 55%, #1a1015 100%)' }}>

          {/* Decorative diamond */}
          <motion.div className="mb-8"
            initial={{ scale: 0, rotate: -20 }} animate={isRevealed ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 2 L20 16 L34 18 L20 20 L18 34 L16 20 L2 18 L16 16 Z" fill={GOLD} opacity="0.45" />
              <circle cx="18" cy="18" r="3" fill={IVORY} opacity="0.55" />
            </svg>
          </motion.div>

          <motion.h3 className="font-serif mb-6 leading-snug"
            style={{ color: IVORY, fontSize: 'clamp(1.1rem, 2.8vw, 1.6rem)', fontWeight: 300, whiteSpace: 'pre-line' }}
            initial={{ opacity: 0, y: 10 }} animate={isRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.55 }}>
            {HIDDEN_MESSAGE.headline}
          </motion.h3>

          <motion.div className="w-9 h-px mb-6 mx-auto"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)` }}
            initial={{ scaleX: 0 }} animate={isRevealed ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.82 }} />

          <motion.p className="font-serif leading-loose"
            style={{ color: `${CHAMPAGNE}BB`, fontSize: 'clamp(0.82rem, 1.4vw, 0.97rem)', fontWeight: 300, lineHeight: 1.75 }}
            initial={{ opacity: 0 }} animate={isRevealed ? { opacity: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.95 }}>
            {HIDDEN_MESSAGE.body}
          </motion.p>

          <motion.p className="font-serif italic mt-7"
            style={{ color: `${GOLD}55`, fontSize: '0.72rem', letterSpacing: '0.07em' }}
            initial={{ opacity: 0 }} animate={isRevealed ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.25 }}>
            {HIDDEN_MESSAGE.tag}
          </motion.p>
        </div>

        {/* Scratch canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair z-10" />

        {/* Hint pulse */}
        <AnimatePresence>
          {hintVisible && (
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" exit={{ opacity: 0 }}>
              <motion.div className="rounded-full border"
                style={{ width: 60, height: 60, borderColor: `${GOLD}35` }}
                animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reveal glow */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div className="absolute inset-0 pointer-events-none z-20 rounded-3xl"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.55, 0.28] }} transition={{ duration: 2.2 }}
              style={{ boxShadow: `inset 0 0 50px ${GOLD}35, inset 0 0 100px rgba(232,196,196,0.12)` }} />
          )}
        </AnimatePresence>

        {/* Celebration burst */}
        <AnimatePresence>
          {celebrating && Array.from({ length: 26 }).map((_, i) => {
            const angle = (i / 26) * Math.PI * 2;
            const dist  = 65 + Math.random() * 80;
            const color = [GOLD, ROSE, IVORY, CHAMPAGNE, '#FFD0A0'][i % 5];
            return (
              <motion.div key={i} className="absolute pointer-events-none rounded-full z-30"
                style={{ width: 3 + Math.random() * 4, height: 3 + Math.random() * 4, background: color, boxShadow: `0 0 5px ${color}`, top: '50%', left: '50%' }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: i * 0.022 }} />
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Scratch particles */}
      {particles.map(p => <ScratchParticle key={p.id} x={p.x} y={p.y} color={p.color} />)}

      {/* After reveal */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div className="mt-12 text-center z-10 px-6 max-w-xs"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center gap-3">
              <div className="h-px flex-grow" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}30)` }} />
              <p className="font-serif italic" style={{ color: `${GOLD}70`, fontSize: 'clamp(0.78rem, 1.3vw, 0.9rem)', letterSpacing: '0.05em' }}>
                sekarang kamu tahu
              </p>
              <div className="h-px flex-grow" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}30)` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner glows */}
      <div className="absolute top-0 left-0 w-56 h-56 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ROSE}07 0%, transparent 70%)`, filter: 'blur(35px)' }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD}05 0%, transparent 70%)`, filter: 'blur(35px)' }} />
    </section>
  );
}
