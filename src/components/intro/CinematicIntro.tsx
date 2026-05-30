'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useAudio } from '@/components/providers/AudioProvider';

const DARK = '#0A0908';
const GOLD = '#D4A574';
const ROSE = '#E8C4C4';
const BLUSH = '#F2D5D0';
const CHAMPAGNE = '#F5E6D3';
const IVORY = '#FFF8F0';

const PETAL_PALETTE = [ROSE, BLUSH, GOLD, CHAMPAGNE];
const PARTICLE_COUNT = 50;

interface Particle {
  x: number; y: number; baseX: number; baseY: number;
  size: number; opacity: number; speedX: number; speedY: number; phase: number;
}

interface CinematicIntroProps {
  onBegin: () => void;
}

/* ═══════════════════════════════════════════════════════
   Falling petal (CSS)
   ═══════════════════════════════════════════════════════ */
function FallingPetal({ index }: { index: number }) {
  const size = 6 + Math.random() * 10;
  const left = Math.random() * 100;
  const dur = 18 + Math.random() * 18;
  const delay = Math.random() * 22;
  const color = PETAL_PALETTE[index % PETAL_PALETTE.length];
  const sway = 25 + Math.random() * 50;
  return (
    <div className="absolute pointer-events-none"
      style={{
        left: `${left}%`, top: -25,
        width: size, height: size * 1.3,
        borderRadius: '50% 50% 50% 0%',
        backgroundColor: color,
        opacity: 0.15 + Math.random() * 0.2,
        animation: `intro-petal-fall ${dur}s ${delay}s linear infinite`,
        ['--sway' as string]: `${sway}px`,
        transform: `rotate(${Math.random() * 360}deg)`,
        filter: `blur(${Math.random() > 0.6 ? 1 : 0}px)`,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   Floral corner decoration
   ═══════════════════════════════════════════════════════ */
function IntroFloral({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const cls: Record<string, string> = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0 scale-x-[-1]',
    bl: 'bottom-0 left-0 scale-y-[-1]',
    br: 'bottom-0 right-0 scale-[-1]',
  };
  return (
    <motion.div className={`absolute pointer-events-none ${cls[pos]}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.5 }}>
      <svg className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48" viewBox="0 0 200 200" fill="none" style={{ opacity: 0.06 }}>
        <path d="M10 190 Q20 140 40 100 Q60 65 95 40 Q120 25 160 15" stroke={GOLD} strokeWidth="0.8" fill="none" />
        <path d="M40 100 Q55 88 70 92" stroke={GOLD} strokeWidth="0.5" fill="none" />
        <path d="M70 70 Q80 58 92 62" stroke={GOLD} strokeWidth="0.5" fill="none" />
        {[0,72,144,216,288].map((a,i) => (
          <ellipse key={i} cx="150" cy="14" rx="5" ry="10" fill={BLUSH} opacity={0.4+i*0.04} transform={`rotate(${a} 150 22)`} />
        ))}
        <circle cx="150" cy="22" r="2.5" fill={GOLD} opacity="0.3" />
        <ellipse cx="66" cy="88" rx="6" ry="2" fill={GOLD} opacity="0.2" transform="rotate(-28 66 88)" />
        <ellipse cx="88" cy="60" rx="5" ry="1.8" fill={GOLD} opacity="0.15" transform="rotate(-15 88 60)" />
        <ellipse cx="30" cy="150" rx="3.5" ry="6" fill={ROSE} opacity="0.15" transform="rotate(8 30 150)" />
      </svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   Center floral ornament
   ═══════════════════════════════════════════════════════ */
function CenterOrnament() {
  return (
    <motion.div className="flex items-center justify-center gap-3 my-6"
      initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 1.2, delay: 0.8, ease: [0.22,1,0.36,1] }}>
      <div className="h-px flex-grow max-w-[60px] sm:max-w-[80px]"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}30)` }} />
      <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.15 }}>
        {[0,72,144,216,288].map((a,i) => (
          <ellipse key={i} cx="16" cy="6" rx="3.5" ry="7" fill={BLUSH} opacity={0.5} transform={`rotate(${a} 16 16)`} />
        ))}
        <circle cx="16" cy="16" r="2" fill={GOLD} opacity="0.4" />
      </svg>
      <div className="h-px flex-grow max-w-[60px] sm:max-w-[80px]"
        style={{ background: `linear-gradient(270deg, transparent, ${GOLD}30)` }} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════ */
export default function CinematicIntro({ onBegin }: CinematicIntroProps) {
  const { playClick, playHover } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 3500);
    const t2 = setTimeout(() => setPhase(2), 7500);
    const t3 = setTimeout(() => setPhase(3), 11500);
    const t4 = setTimeout(() => setPhase(4), 16000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      return { x, y, baseX: x, baseY: y, size: 0.8 + Math.random() * 1.8,
        opacity: 0.08 + Math.random() * 0.35, speedX: (Math.random()-0.5)*0.2, speedY: (Math.random()-0.5)*0.15, phase: Math.random()*Math.PI*2 };
    });

    let time = 0;
    const animate = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.baseX += p.speedX;
        p.baseY += p.speedY;
        if (p.baseX < -10) p.baseX = canvas.width + 10;
        if (p.baseX > canvas.width + 10) p.baseX = -10;
        if (p.baseY < -10) p.baseY = canvas.height + 10;
        if (p.baseY > canvas.height + 10) p.baseY = -10;
        p.x = p.baseX + Math.sin(time + p.phase) * 8;
        p.y = p.baseY + Math.cos(time + p.phase) * 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Softer, dreamy warm colors
        ctx.fillStyle = `rgba(250, 220, 210, ${p.opacity})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  const handleBtnMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setBtnOffset({ x: (e.clientX - r.left - r.width/2) * 0.12, y: (e.clientY - r.top - r.height/2) * 0.12 });
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 100 });

  const handleGlobalMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * -30;
    const y = (e.clientY / window.innerHeight - 0.5) * -30;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      onMouseMove={handleGlobalMove}
      style={{ backgroundColor: DARK }}
      initial={{ scale: 1 }}
      animate={{ scale: 1.04 }}
      transition={{ duration: 25, ease: 'easeOut' }}>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes intro-petal-fall {
          0% { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.25; }
          92% { opacity: 0.15; }
          100% { transform: translateY(110vh) translateX(var(--sway)) rotate(720deg); opacity: 0; }
        }
      `}} />

      {/* Canvas particles */}
      <motion.div className="absolute inset-0 z-0"
        style={{ x: springX, y: springY }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </motion.div>

      {/* Ambient glow */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 'clamp(250px, 35vw, 500px)', height: 'clamp(250px, 35vw, 500px)', left: '18%', top: '25%',
          background: `radial-gradient(circle, ${ROSE}10 0%, transparent 70%)`, filter: 'blur(60px)' }}
        animate={{ x: [0,25,-15,0], y: [0,-18,12,0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 'clamp(200px, 30vw, 400px)', height: 'clamp(200px, 30vw, 400px)', right: '15%', bottom: '20%',
          background: `radial-gradient(circle, ${GOLD}0C 0%, transparent 70%)`, filter: 'blur(60px)' }}
        animate={{ x: [0,-20,15,0], y: [0,15,-10,0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Falling petals */}
      {Array.from({ length: 20 }).map((_, i) => <FallingPetal key={i} index={i} />)}

      {/* Film grain */}
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '2px 2px' }} />

      {/* Vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, transparent 25%, ${DARK}cc 78%, ${DARK} 100%)` }} />

      {/* Corner florals */}
      <IntroFloral pos="tl" />
      <IntroFloral pos="tr" />
      <IntroFloral pos="bl" />
      <IntroFloral pos="br" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-3xl">

        <AnimatePresence>
          {phase >= 0 && (
            <motion.h1 className="font-serif absolute w-full"
              style={{ color: IVORY, fontWeight: 300, whiteSpace: 'nowrap',
                fontSize: 'clamp(1.5rem, 4vw, 3.8rem)', lineHeight: 1.3, top: '-60px' }}
              initial={{ opacity: 0, y: 20, letterSpacing: '0.05em', filter: 'blur(10px)' }}
              animate={phase === 0 ? { opacity: 1, y: 0, letterSpacing: '-0.01em', filter: 'blur(0px)' } : { opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 3, ease: [0.22,1,0.36,1] }}>
              Hai Asa...
            </motion.h1>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 1 && (
            <motion.p className="font-serif absolute w-full px-4"
              style={{ color: `${CHAMPAGNE}DD`, fontWeight: 300,
                fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', lineHeight: 1.7, top: '-20px' }}
              initial={{ opacity: 0, y: 20, letterSpacing: '0.1em', filter: 'blur(10px)' }}
              animate={phase === 1 ? { opacity: 1, y: 0, letterSpacing: '0.02em', filter: 'blur(0px)' } : { opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 3, ease: [0.22,1,0.36,1] }}>
              Tarik napas sebentar yuk.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.p className="font-serif absolute w-full px-4"
              style={{ color: `${CHAMPAGNE}DD`, fontWeight: 300,
                fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', lineHeight: 1.7, top: '-20px' }}
              initial={{ opacity: 0, y: 20, letterSpacing: '0.1em', filter: 'blur(10px)' }}
              animate={phase === 2 ? { opacity: 1, y: 0, letterSpacing: '0.02em', filter: 'blur(0px)' } : { opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 3, ease: [0.22,1,0.36,1] }}>
              Hari ini itu harimu.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 3 && (
            <motion.div className="flex flex-col items-center mt-12 w-full px-4"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={phase === 3 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 3, ease: [0.22,1,0.36,1] }}>
              
              <CenterOrnament />
              
              <p className="font-serif mt-6 max-w-lg mx-auto"
                style={{ color: IVORY, fontWeight: 300,
                  fontSize: 'clamp(1.2rem, 2.8vw, 1.9rem)', lineHeight: 1.6, letterSpacing: '0.02em' }}>
                Aku sengaja bikin ini<br className="sm:hidden" /> khusus buat kamu.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Begin button — cinematic film style */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div className="absolute inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 3, ease: [0.22,1,0.36,1] }}>

              {/* Outer glow ring */}
              <motion.div className="absolute -inset-3 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${GOLD}0A 0%, transparent 70%)` }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />

              <motion.button
                ref={buttonRef}
                onClick={() => { playClick(); onBegin(); }}
                onMouseEnter={playHover}
                onMouseMove={handleBtnMove}
                onMouseLeave={() => setBtnOffset({ x: 0, y: 0 })}
                className="relative px-10 sm:px-14 py-3.5 sm:py-4 rounded-full font-serif cursor-pointer select-none overflow-hidden"
                animate={{ x: btnOffset.x, y: btnOffset.y }}
                style={{
                  background: 'transparent',
                  border: `1px solid ${GOLD}35`,
                  color: IVORY,
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                  transition: 'border-color 0.4s, box-shadow 0.4s',
                }}
                whileHover={{
                  borderColor: `${GOLD}60`,
                  boxShadow: `0 0 30px ${GOLD}15, 0 0 60px ${ROSE}08`,
                }}>

                {/* Shimmer line on hover */}
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(105deg, transparent 40%, ${GOLD}12 50%, transparent 60%)`,
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

                <span className="relative z-10">Mulai</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
