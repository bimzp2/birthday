'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/**
 * EternalEnding — The final section of the experience.
 * Infinite looping particles, a grand final message, and a delicate
 * "You've reached the end, but the story continues" feeling.
 */

interface Particle {
  id: number; x: number; y: number; size: number; duration: number; delay: number; color: string;
}

export default function EternalEnding() {
  const sectionRef = useRef<HTMLElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  // Parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ['-20%', '0%']);
  const yContent = useTransform(scrollYProgress, [0, 1], ['20%', '0%']);
  const opacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);

  useEffect(() => {
    // Generate organic particles
    const pts = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 10,
      color: i % 3 === 0 ? '#D4A574' : i % 3 === 1 ? '#F5E6D3' : '#E8C4C4',
    }));
    setParticles(pts);
    setIsVisible(true);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0908 0%, #1a1510 50%, #0A0908 100%)',
      }}>

      {/* Deep space / warm glow background with parallax */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: yBg }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, rgba(232,196,196,0.03) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
      </motion.div>

      {/* Floating eternal particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <AnimatePresence>
          {isVisible && particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Content */}
      <motion.div className="relative z-20 text-center px-6 max-w-4xl mx-auto"
        style={{ y: yContent, opacity }}>
        
        {/* Subtle decorative top */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 opacity-[0.15]" viewBox="0 0 60 60" fill="none">
            <path d="M30 0 L32 28 L60 30 L32 32 L30 60 L28 32 L0 30 L28 28 Z" fill="#D4A574" />
            <circle cx="30" cy="30" r="4" fill="#FFF8F0" opacity="0.8" />
          </svg>
        </div>

        <motion.h2 className="font-serif leading-tight mb-8"
          style={{ color: '#FFF8F0', fontWeight: 300, fontSize: 'clamp(1.6rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}>
          Semoga kamu selalu bahagia, <br className="hidden sm:block" /> hari ini dan seterusnya.
        </motion.h2>

        <motion.div className="mx-auto my-10 h-px w-24 sm:w-32"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.3), transparent)' }} />

        <motion.p className="font-serif italic"
          style={{ color: 'rgba(245,230,211,0.6)', fontWeight: 300, fontSize: 'clamp(1rem, 2vw, 1.4rem)', lineHeight: 1.8 }}>
          Makasih udah jadi bagian dari ceritaku. <br />
          <span className="inline-block mt-4" style={{ color: 'rgba(212,165,116,0.8)', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
            Selamat Ulang Tahun, Asa.
          </span>
        </motion.p>

        {/* Endless scroll indicator */}
        <motion.div className="mt-24 flex flex-col items-center gap-3 opacity-30"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="w-px h-16" style={{ background: 'linear-gradient(to bottom, transparent, #D4A574, transparent)' }} />
          <span className="font-serif text-[0.6rem] uppercase tracking-[0.3em]" style={{ color: '#F5E6D3' }}>Selamanya</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
