'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MemoryGarden — Interactive flowers that bloom on hover and reveal hidden messages.
 * Each flower is unique with organic SVG petals.
 */

interface FlowerItem {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  message: string;
  petalCount: number;
  delay: number;
}

const FLOWERS: FlowerItem[] = [
  { id: 1, x: 12, y: 35, size: 1.2, color: '#E8C4C4', message: 'Kamu membuat dunia mekar', petalCount: 6, delay: 0 },
  { id: 2, x: 28, y: 60, size: 0.9, color: '#F2D5D0', message: 'Setiap momen bersamamu adalah hadiah', petalCount: 5, delay: 0.2 },
  { id: 3, x: 42, y: 28, size: 1.1, color: '#EDCFC4', message: 'Cahayamu menjangkau lebih jauh dari yang kamu tahu', petalCount: 7, delay: 0.4 },
  { id: 4, x: 58, y: 55, size: 1.0, color: '#F5E6D3', message: 'Kamu adalah kehangatan di setiap musim', petalCount: 6, delay: 0.6 },
  { id: 5, x: 72, y: 32, size: 1.3, color: '#E8C4C4', message: 'Ada jiwa yang seperti taman — milikmu tak terbatas', petalCount: 8, delay: 0.8 },
  { id: 6, x: 86, y: 48, size: 0.85, color: '#F2D5D0', message: 'Tumbuh, selalu tumbuh, selalu indah', petalCount: 5, delay: 1.0 },
  { id: 7, x: 50, y: 72, size: 1.0, color: '#EDCFC4', message: 'Bunga tak pernah bersaing — ia hanya mekar', petalCount: 6, delay: 1.2 },
  { id: 8, x: 20, y: 50, size: 1.05, color: '#E8C4C4', message: 'Berakar dalam cinta, meraih cahaya', petalCount: 7, delay: 0.3 },
];

function GardenFlower({ flower, onReveal }: { flower: FlowerItem; onReveal: (msg: string) => void }) {
  const [bloomed, setBloomed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [petalParticles, setPetalParticles] = useState<number[]>([]);

  const petals = useMemo(() => {
    return Array.from({ length: flower.petalCount }, (_, i) => ({
      angle: (360 / flower.petalCount) * i,
      rx: 8 + Math.random() * 4,
      ry: 16 + Math.random() * 6,
    }));
  }, [flower.petalCount]);

  const handleClick = () => {
    onReveal(flower.message);
    setShowTooltip(true);
    setPetalParticles(Array.from({ length: 6 }, (_, i) => i));
    setTimeout(() => setShowTooltip(false), 3500);
    setTimeout(() => setPetalParticles([]), 2000);
  };

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${flower.x}%`,
        top: `${flower.y}%`,
        transform: `scale(${flower.size})`,
        zIndex: bloomed ? 10 : 5,
      }}
      onMouseEnter={() => setBloomed(true)}
      onMouseLeave={() => { if (!showTooltip) setBloomed(false); }}
      onClick={handleClick}
    >
      {/* Stem */}
      <svg viewBox="0 0 60 100" className="w-12 h-20 sm:w-16 sm:h-24" fill="none">
        <path d="M30 95 Q28 70 30 50" stroke="#8B9D83" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
        <ellipse cx="38" cy="68" rx="7" ry="3" fill="#8B9D83" opacity="0.2" transform="rotate(-20 38 68)" />
        <ellipse cx="22" cy="78" rx="6" ry="2.5" fill="#8B9D83" opacity="0.18" transform="rotate(15 22 78)" />

        {/* Petals */}
        <g transform="translate(30, 40)">
          {petals.map((p, i) => (
            <motion.ellipse
              key={i}
              cx="0" cy={-p.ry * 0.6}
              rx={p.rx} ry={p.ry}
              fill={flower.color}
              opacity={0.6 + i * 0.03}
              transform={`rotate(${p.angle})`}
              initial={{ scale: 0.2, opacity: 0 }}
              animate={bloomed ? { scale: 1, opacity: 0.6 + i * 0.03 } : { scale: 0.2, opacity: 0 }}
              transition={{ duration: 0.8, delay: flower.delay + i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
            />
          ))}
          {/* Center */}
          <motion.circle
            cx="0" cy="0" r="5"
            fill="#D4A574" opacity="0.6"
            initial={{ scale: 0 }}
            animate={bloomed ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: flower.delay + 0.5 }}
          />
          <motion.circle
            cx="0" cy="0" r="2.5"
            fill="#C49460" opacity="0.5"
            initial={{ scale: 0 }}
            animate={bloomed ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.4, delay: flower.delay + 0.6 }}
          />
        </g>
      </svg>

      {/* Petal particles on click */}
      <AnimatePresence>
        {petalParticles.map((i) => {
          const angle = Math.random() * Math.PI * 2;
          const dist = 30 + Math.random() * 40;
          return (
            <motion.div
              key={`petal-${i}`}
              className="absolute pointer-events-none"
              style={{
                width: 5 + Math.random() * 4,
                height: 7 + Math.random() * 5,
                borderRadius: '50% 50% 50% 0%',
                backgroundColor: flower.color,
                top: '30%', left: '50%',
              }}
              initial={{ x: 0, y: 0, opacity: 0.8, rotate: 0 }}
              animate={{
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist - 30,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          );
        })}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-xl z-20"
            style={{
              background: 'rgba(255,248,240,0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,165,116,0.15)',
              boxShadow: '0 4px 16px rgba(26,22,20,0.06)',
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-serif text-center"
              style={{ color: '#1A1614', fontSize: '0.7rem', fontWeight: 400 }}>
              {flower.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MemoryGarden() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FAF0E6 30%, #F5E6D3 60%, #FAF0E6 100%)', minHeight: '70vh' }}>

      {/* Paper texture */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(26,22,20,0.006) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }} />

      {/* Heading */}
      <motion.div className="text-center mb-10 sm:mb-14 px-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
        <h2 className="font-serif tracking-[-0.02em] mb-3"
          style={{ color: '#1A1614', fontWeight: 300, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
          Taman Kenangan
        </h2>
        <p className="font-serif italic"
          style={{ color: 'rgba(212,165,116,0.6)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>
          hover untuk mekar, klik untuk menemukan
        </p>
        <div className="mx-auto mt-4 h-px w-12 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.4), transparent)' }} />
      </motion.div>

      {/* Garden area */}
      <div className="relative max-w-6xl mx-auto px-4" style={{ minHeight: '45vh' }}>
        {/* Ambient particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              backgroundColor: i % 2 === 0 ? '#D4A574' : '#E8C4C4',
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              opacity: 0.08 + Math.random() * 0.06,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.06, 0.12, 0.06],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Flowers */}
        {FLOWERS.map((f) => (
          <GardenFlower key={f.id} flower={f} onReveal={() => {}} />
        ))}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FFF8F0, transparent)' }} />
    </section>
  );
}
