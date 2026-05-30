'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * EnvelopeReveal — A cute animated envelope that opens to reveal a message inside.
 * The flap opens slowly with a cinematic feel, then a card slides out.
 */
interface EnvelopeRevealProps {
  message: string;
  subMessage?: string;
  delay?: number;
}

export default function EnvelopeReveal({ message, subMessage, delay = 0 }: EnvelopeRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setCardVisible(true), (delay + 1.8) * 1000);
      return () => clearTimeout(t);
    }
  }, [inView, delay]);

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center py-20 sm:py-28">
      {/* Envelope */}
      <div className="relative" style={{ width: 200, height: 140, perspective: '600px' }}>
        {/* Envelope body */}
        <div className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #F5E6D3 0%, #FAF0E6 50%, #F0E4D7 100%)',
            boxShadow: '0 4px 20px rgba(26,22,20,0.08), 0 1px 4px rgba(26,22,20,0.04)',
          }}>
          {/* Paper texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
          
          {/* Gold seal */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D4A574, #E8C9A0)', boxShadow: '0 2px 6px rgba(212,165,116,0.3)' }}>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <path d="M10 3 C6 7 3 9 3 12 C3 15 5 17 8 17 C9 17 10 16 10 15 C10 16 11 17 12 17 C15 17 17 15 17 12 C17 9 14 7 10 3Z"
                fill="#FFF8F0" opacity="0.7" />
            </svg>
          </div>
        </div>

        {/* Envelope flap (opens upward) */}
        <motion.div
          className="absolute top-0 left-0 right-0 origin-top"
          style={{ height: 75, transformStyle: 'preserve-3d' }}
          initial={{ rotateX: 0 }}
          animate={inView ? { rotateX: -180 } : { rotateX: 0 }}
          transition={{ duration: 2.2, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Front of flap */}
          <div className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #EDCFC4 0%, #F5E6D3 100%)',
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              backfaceVisibility: 'hidden',
              borderRadius: '8px 8px 0 0',
            }} />
          {/* Back of flap */}
          <div className="absolute inset-0"
            style={{
              background: 'linear-gradient(0deg, #FAF0E6 0%, #F0E4D7 100%)',
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }} />
        </motion.div>

        {/* Card sliding out */}
        <AnimatePresence>
          {cardVisible && (
            <motion.div
              className="absolute left-1/2 w-[85%] rounded-lg flex items-center justify-center p-3"
              style={{
                background: '#FFFDF9',
                boxShadow: '0 2px 10px rgba(26,22,20,0.06)',
                transform: 'translateX(-50%)',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -60, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-serif text-center"
                style={{ color: '#1A1614', fontSize: 'clamp(0.65rem, 1vw, 0.8rem)', lineHeight: 1.5, fontWeight: 400 }}>
                {message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparkle particles when opening */}
        <AnimatePresence>
          {inView && Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const dist = 50 + Math.random() * 40;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  backgroundColor: i % 3 === 0 ? '#D4A574' : i % 3 === 1 ? '#E8C4C4' : '#F2D5D0',
                  top: '30%', left: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist - 20,
                  opacity: [0, 0.7, 0],
                  scale: [0, 1.2, 0],
                }}
                transition={{ duration: 1.5, delay: delay + 1.5 + i * 0.06, ease: 'easeOut' }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Sub message */}
      {subMessage && (
        <motion.p
          className="font-serif italic mt-10"
          style={{ color: 'rgba(212,165,116,0.5)', fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)', letterSpacing: '0.08em' }}
          initial={{ opacity: 0, y: 8 }}
          animate={cardVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {subMessage}
        </motion.p>
      )}
    </div>
  );
}
