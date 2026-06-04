'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const IVORY = '#FFF8F0';
const GOLD = '#D4A574';
const ROSE = '#E8C4C4';
const BLUSH = '#F2D5D0';
const DARK = '#0A0908';
const CHAMPAGNE = '#F5E6D3';

const CORRECT_CODE = '1409';

interface PasscodeScreenProps {
  onSuccess: () => void;
}

interface BurstParticle {
  id: number; angle: number; distance: number; size: number;
}

interface Ripple {
  id: number; inputIdx: number;
}

function ParticleBurst({ particles }: { particles: BurstParticle[] }) {
  return (
    <>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        return (
          <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
            style={{ width: p.size, height: p.size, backgroundColor: GOLD,
              top: '50%', left: '50%', marginTop: -p.size/2, marginLeft: -p.size/2 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(rad)*p.distance, y: Math.sin(rad)*p.distance, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }} />
        );
      })}
    </>
  );
}

function RippleRing() {
  return (
    <motion.div className="absolute inset-0 rounded-full pointer-events-none"
      style={{ border: `1.5px solid ${GOLD}` }}
      initial={{ scale: 0.5, opacity: 0.7 }}
      animate={{ scale: 1.7, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }} />
  );
}

/* Small floral decoration for passcode card */
function PasscodeFloral({ pos }: { pos: 'top' | 'bottom' }) {
  const isTop = pos === 'top';
  return (
    <div className={`absolute ${isTop ? '-top-1 -right-1' : '-bottom-1 -left-1'} pointer-events-none`}
      style={{ transform: isTop ? 'none' : 'rotate(180deg)' }}>
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 60 60" fill="none" style={{ opacity: 0.06 }}>
        <path d="M50 55 Q45 40 40 30 Q35 22 25 15" stroke={GOLD} strokeWidth="0.6" fill="none" />
        {[0,72,144,216,288].map((a,i) => (
          <ellipse key={i} cx="22" cy="8" rx="3" ry="6" fill={BLUSH} opacity={0.5} transform={`rotate(${a} 22 14)`} />
        ))}
        <circle cx="22" cy="14" r="1.5" fill={GOLD} opacity="0.3" />
        <ellipse cx="38" cy="28" rx="4" ry="1.5" fill={GOLD} opacity="0.2" transform="rotate(-25 38 28)" />
      </svg>
    </div>
  );
}

export default function PasscodeScreen({ onSuccess }: PasscodeScreenProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [showDigit, setShowDigit] = useState<boolean[]>([false, false, false, false]);
  const [error, setError] = useState(false);
  const [fails, setFails] = useState(0);
  const [bursts, setBursts] = useState<{ inputIdx: number; particles: BurstParticle[] }[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const burstIdRef = useRef(0);
  const rippleIdRef = useRef(0);

  const handleChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, '').slice(-1);
      if (!digit) return;

      const next = [...digits];
      next[index] = digit;
      setDigits(next);
      setError(false);

      setShowDigit((prev) => { const n = [...prev]; n[index] = true; return n; });
      setTimeout(() => { setShowDigit((prev) => { const n = [...prev]; n[index] = false; return n; }); }, 400);

      const newP: BurstParticle[] = Array.from({ length: 4 }, () => ({
        id: burstIdRef.current++, angle: Math.random()*360, distance: 18+Math.random()*22, size: 2+Math.random()*2.5,
      }));
      setBursts((prev) => [...prev, { inputIdx: index, particles: newP }]);
      setTimeout(() => setBursts((prev) => prev.filter((b) => b.particles !== newP)), 600);

      const rId = rippleIdRef.current++;
      setRipples((prev) => [...prev, { id: rId, inputIdx: index }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== rId)), 600);

      if (index < 3) inputRefs.current[index + 1]?.focus();

      if (index === 3 && next.every((d) => d !== '')) {
        const code = next.join('');
        setTimeout(() => {
          if (code === CORRECT_CODE) { onSuccess(); }
          else {
            setError(true);
            setFails((f) => f + 1);
            setTimeout(() => { setDigits(['','','','']); setError(false); inputRefs.current[0]?.focus(); }, 700);
          }
        }, 150);
      }
    },
    [digits, onSuccess],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (digits[index] === '' && index > 0) {
          inputRefs.current[index - 1]?.focus();
          const next = [...digits]; next[index - 1] = ''; setDigits(next);
        } else {
          const next = [...digits]; next[index] = ''; setDigits(next);
        }
      }
    },
    [digits],
  );

  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-200, 200], [10, -10]);
  const rotateY = useTransform(cardX, [-200, 200], [-10, 10]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set(e.clientX - rect.left - rect.width / 2);
    cardY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleCardMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a1510 50%, ${DARK} 100%)` }}>

      {/* Ambient blobs */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 'clamp(250px, 40vw, 500px)', height: 'clamp(250px, 40vw, 500px)', top: '8%', left: '15%',
          background: `radial-gradient(circle, ${ROSE}20 0%, transparent 70%)`, filter: 'blur(50px)' }}
        animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 'clamp(200px, 35vw, 400px)', height: 'clamp(200px, 35vw, 400px)', bottom: '8%', right: '12%',
          background: `radial-gradient(circle, ${GOLD}15 0%, transparent 70%)`, filter: 'blur(50px)' }}
        animate={{ x: [0, -15, 20, 0], y: [0, 15, -15, 0] }} />

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '2px 2px' }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes passcode-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes passcode-border-glow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />

      {/* Glass card */}
      <motion.div
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        className="relative max-w-sm w-full mx-5 rounded-3xl p-8 sm:p-12 flex flex-col items-center overflow-hidden"
        style={{ 
            background: 'rgba(20, 15, 12, 0.4)', 
            backdropFilter: 'blur(60px) saturate(150%)', 
            WebkitBackdropFilter: 'blur(60px) saturate(150%)',
            border: `1px solid rgba(212, 165, 116, 0.1)`,
            boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 40px rgba(212,165,116,0.05)',
            perspective: 1000,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}>

        {/* Animated gradient border glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${GOLD}, transparent 60%)`,
          }} />

        {/* Floral decorations */}
        <PasscodeFloral pos="top" />
        <PasscodeFloral pos="bottom" />

        {/* Title */}
        <h2 className="font-serif mb-7 text-center"
          style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 300,
            background: `linear-gradient(90deg, ${CHAMPAGNE}, ${IVORY}, ${GOLD}, ${IVORY}, ${CHAMPAGNE})`,
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'passcode-shimmer 5s ease-in-out infinite',
          }}>
          Masukkin tanggal spesial kita ya
        </h2>

        {/* Digit inputs */}
        <motion.div className="flex gap-3.5 sm:gap-4"
          animate={error ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
          transition={error ? { duration: 0.4, ease: 'easeInOut' } : {}}>
          {digits.map((digit, i) => {
            const filled = digit !== '';
            const isFocused = focusedIndex === i;
            return (
              <div key={i} className="relative flex items-center justify-center" style={{ width: 54, height: 54 }}>
                <div className="absolute inset-0 rounded-full"
                  style={{ 
                    background: filled ? `${GOLD}1A` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isFocused ? `${GOLD}80` : filled ? `${GOLD}40` : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isFocused ? `0 0 20px ${GOLD}20, inset 0 0 10px ${GOLD}10` : 'none',
                    transition: 'all 0.3s ease'
                  }} />
                <AnimatePresence>
                  {ripples.filter((r) => r.inputIdx === i).map((r) => <RippleRing key={r.id} />)}
                </AnimatePresence>
                {bursts.filter((b) => b.inputIdx === i).map((b, bi) => <ParticleBurst key={bi} particles={b.particles} />)}
                <motion.input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text" inputMode="numeric" maxLength={1}
                  value={showDigit[i] && digit ? digit : filled ? '\u2022' : ''}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={() => setFocusedIndex(i)}
                  onBlur={() => setFocusedIndex(null)}
                  autoFocus={i === 0}
                  className="relative z-10 w-full h-full rounded-full text-center font-serif text-lg outline-none caret-transparent bg-transparent"
                  style={{
                    color: IVORY,
                  }}
                />
              </div>
            );
          })}
        </motion.div>

        {/* Error / hint */}
        <AnimatePresence>
          {error && (
            <motion.p className="mt-5 font-serif"
              style={{ color: BLUSH, fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)' }}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              Masa lupa sih... coba lagi deh
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {fails >= 3 && !error && (
            <motion.p className="mt-5 tracking-wide font-serif"
              style={{ color: `${GOLD}99`, fontSize: 'clamp(0.7rem, 1vw, 0.8rem)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              kode kuncinya {CORRECT_CODE} 
            </motion.p>
          )}
        </AnimatePresence>

        {!error && fails < 3 && (
          <p className="mt-5 tracking-wide font-serif"
            style={{ color: `${CHAMPAGNE}40`, fontSize: 'clamp(0.6rem, 1vw, 0.7rem)' }}>
            kode 4 digit
          </p>
        )}
      </motion.div>
    </div>
  );
}
