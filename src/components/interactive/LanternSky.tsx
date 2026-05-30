'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DARK = '#0A0908';
const GOLD = '#D4A574';
const CHAMPAGNE = '#F5E6D3';

interface Lantern {
  id: number;
  x: number;
  y: number;
  scale: number;
  speedY: number;
  swayAmplitude: number;
  swaySpeed: number;
}

export default function LanternSky() {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lanternIdRef = useRef(0);

  const releaseLantern = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;

    const newLantern: Lantern = {
      id: lanternIdRef.current++,
      x,
      y: 110, // Start below viewport
      scale: 0.5 + Math.random() * 0.5,
      speedY: 2 + Math.random() * 3, // seconds to travel 10% viewport
      swayAmplitude: 2 + Math.random() * 4,
      swaySpeed: 2 + Math.random() * 2
    };

    setLanterns(prev => [...prev, newLantern]);

    // Cleanup lantern after 20 seconds
    setTimeout(() => {
      setLanterns(prev => prev.filter(l => l.id !== newLantern.id));
    }, 20000);
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[80vh] w-full overflow-hidden cursor-pointer"
      style={{ background: `linear-gradient(to top, #1A1510 0%, ${DARK} 100%)` }}
      onClick={releaseLantern}
    >
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '0 0' }} />
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(212,165,116,0.8) 2px, transparent 2px)', backgroundSize: '90px 90px', backgroundPosition: '20px 20px' }} />

      {/* Instructional text */}
      <div className="absolute inset-x-0 top-1/3 flex flex-col items-center justify-center text-center pointer-events-none z-10 px-4">
        <h2 className="font-serif tracking-widest uppercase mb-4" style={{ color: GOLD, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          Terbangkan Harapan
        </h2>
        <p className="font-serif italic" style={{ color: `${CHAMPAGNE}A0`, fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
          Ketuk layar untuk melepaskan lampion ke langit
        </p>
      </div>

      <AnimatePresence>
        {lanterns.map((l) => (
          <motion.div
            key={l.id}
            className="absolute bottom-0 pointer-events-none"
            initial={{ left: `${l.x}%`, y: '10vh', opacity: 0, scale: l.scale * 0.8 }}
            animate={{ 
              y: '-120vh', 
              opacity: [0, 1, 1, 0],
              x: [0, l.swayAmplitude * 10, -l.swayAmplitude * 10, 0, l.swayAmplitude * 10]
            }}
            transition={{
              y: { duration: l.speedY * 10, ease: 'linear' },
              opacity: { duration: l.speedY * 10, times: [0, 0.1, 0.8, 1] },
              x: { duration: l.swaySpeed * 5, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 1 }
            }}
          >
            {/* Lantern Body */}
            <div className="relative flex flex-col items-center justify-center" style={{ width: 40, height: 60 }}>
              <div className="absolute inset-0 rounded-[10px_10px_4px_4px]" 
                style={{ 
                  background: 'linear-gradient(to top, #FF7B00, #FFDD55)',
                  boxShadow: '0 0 20px #FF9900, inset 0 -10px 20px #FF3300'
                }} 
              />
              {/* Flame glow */}
              <div className="absolute bottom-2 w-6 h-6 rounded-full"
                style={{ background: '#FFF', filter: 'blur(4px)', opacity: 0.8 }} />
              {/* Wire at bottom */}
              <div className="absolute -bottom-2 w-8 h-2 border-b border-black opacity-30 rounded-[50%]" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}
