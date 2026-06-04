'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const GOLD  = '#D4A574';
const IVORY = '#FFF8F0';
const ROSE  = '#E8C4C4';
const CHAMPAGNE = '#F5E6D3';
const CREAM = '#FAF0E6';

interface EnvelopeRevealProps {
  message: string;
  subMessage?: string;
  delay?: number;
}

export default function EnvelopeReveal({ message, subMessage, delay = 0 }: EnvelopeRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView]       = useState(false);
  const [opened, setOpened]       = useState(false);
  const [cardOut, setCardOut]     = useState(false);
  const [sparkle, setSparkle]     = useState(false);
  const [hovered, setHovered]     = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => { setOpened(true); setSparkle(true); }, (delay + 0.5) * 1000);
    const t2 = setTimeout(() => setCardOut(true), (delay + 2.4) * 1000);
    const t3 = setTimeout(() => setSparkle(false), (delay + 3.5) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inView, delay]);

  // 3D tilt on hover
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rotateX = useTransform(my, [-80, 80], [5, -5]);
  const rotateY = useTransform(mx, [-80, 80], [-5, 5]);

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center py-16 sm:py-24">

      {/* Ambient glow when opened */}
      <AnimatePresence>
        {opened && (
          <motion.div className="absolute pointer-events-none rounded-full"
            style={{ width: 280, height: 120, background: `radial-gradient(ellipse, ${GOLD}18 0%, transparent 70%)`, filter: 'blur(30px)', top: '30%', left: '50%', transform: 'translateX(-50%)' }}
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }} />
        )}
      </AnimatePresence>

      {/* Envelope group */}
      <motion.div
        className="relative"
        style={{ width: 220, height: 154, perspective: 800, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={() => setHovered(true)}
        animate={hovered && !opened ? { scale: 1.03 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Envelope body */}
        <div className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${CHAMPAGNE} 0%, ${CREAM} 50%, #EDD8C0 100%)`,
            boxShadow: opened
              ? `0 8px 40px rgba(0,0,0,0.12), 0 0 30px ${GOLD}25`
              : '0 4px 20px rgba(26,22,20,0.1), 0 1px 4px rgba(26,22,20,0.06)',
            transition: 'box-shadow 1s ease',
          }}>
          {/* Paper grain */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
          {/* Inside color (visible when flap opens) */}
          <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'linear-gradient(180deg, rgba(212,165,116,0.2) 0%, transparent 50%)' }} />

          {/* Bottom V fold lines */}
          <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none opacity-[0.12]" viewBox="0 0 220 154" fill="none">
            <path d="M0 154 L110 80 L220 154Z" stroke={GOLD} strokeWidth="0.5" fill="none" />
          </svg>

          {/* Gold wax seal */}
          <motion.div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center"
            style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${GOLD}, #E8C9A0)`, boxShadow: `0 2px 8px ${GOLD}50` }}
            animate={opened ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <path d="M10 3 C6 7 3 9 3 12 C3 15 5 17 8 17 C9 17 9.8 16 10 15 C10.2 16 11 17 12 17 C15 17 17 15 17 12 C17 9 14 7 10 3Z"
                fill={IVORY} opacity="0.8" />
            </svg>
          </motion.div>
        </div>

        {/* Flap — opens with 3D rotation */}
        <motion.div className="absolute top-0 left-0 right-0"
          style={{ height: 84, transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
          initial={{ rotateX: 0 }}
          animate={opened ? { rotateX: -195 } : { rotateX: 0 }}
          transition={{ duration: 2.0, delay: delay + 0.5, ease: [0.22, 1, 0.36, 1] }}>
          {/* Front of flap */}
          <div className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, #EDCFC4 0%, ${CHAMPAGNE} 100%)`,
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              backfaceVisibility: 'hidden',
              borderRadius: '10px 10px 0 0',
              boxShadow: 'inset 0 -2px 8px rgba(0,0,0,0.04)',
            }} />
          {/* Back of flap */}
          <div className="absolute inset-0"
            style={{
              background: `linear-gradient(0deg, #FAF0E6 0%, #F0E4D7 100%)`,
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }} />
        </motion.div>

        {/* Card that slides out */}
        <AnimatePresence>
          {cardOut && (
            <motion.div
              className="absolute left-1/2 flex flex-col items-center justify-center rounded-xl px-4 py-5 text-center"
              style={{
                width: '82%', transform: 'translateX(-50%)',
                background: IVORY,
                boxShadow: `0 4px 24px rgba(0,0,0,0.1), 0 0 20px ${GOLD}20`,
                border: `1px solid rgba(212,165,116,0.12)`,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: -70, opacity: 1 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}>
              <p className="font-serif leading-relaxed"
                style={{ color: '#1A1614', fontSize: 'clamp(0.65rem, 1.1vw, 0.82rem)', lineHeight: 1.65, fontWeight: 400 }}>
                {message}
              </p>
              {subMessage && (
                <p className="font-serif italic mt-2"
                  style={{ color: `${GOLD}80`, fontSize: '0.6rem', letterSpacing: '0.08em' }}>
                  {subMessage}
                </p>
              )}
              {/* Gold ornament on card */}
              <div className="mt-2">
                <svg width="24" height="8" viewBox="0 0 40 10" fill="none">
                  <path d="M0 5 Q10 0 20 5 Q30 10 40 5" stroke={GOLD} strokeWidth="0.8" opacity="0.4" fill="none" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparkle particles on open */}
        <AnimatePresence>
          {sparkle && Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const dist  = 55 + Math.random() * 55;
            const color = [GOLD, ROSE, CHAMPAGNE, IVORY][i % 4];
            return (
              <motion.div key={i} className="absolute pointer-events-none rounded-full"
                style={{ width: 2 + Math.random() * 3, height: 2 + Math.random() * 3, background: color, boxShadow: `0 0 5px ${color}`, top: '35%', left: '50%' }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 20, opacity: [0, 0.9, 0], scale: [0, 1.2, 0] }}
                transition={{ duration: 1.4, delay: delay + 1.6 + i * 0.05, ease: 'easeOut' }} />
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Click hint before opening */}
      <AnimatePresence>
        {!opened && inView && (
          <motion.p className="mt-8 font-serif italic pointer-events-none"
            style={{ color: `${GOLD}50`, fontSize: '0.65rem', letterSpacing: '0.1em' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}>
            membuka untukmu...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
