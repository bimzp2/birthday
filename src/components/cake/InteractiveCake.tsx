'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const DARK = '#0A0908';
const GOLD = '#D4A574';

/**
 * InteractiveCake — A beautiful birthday cake with a candle.
 * User clicks/taps to blow it out, triggering SFX and confetti.
 */
export default function InteractiveCake() {
  const [blown, setBlown] = useState(false);
  const [smoke, setSmoke] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play a synthetic magical "whoosh/chime" sound
  const playBlowSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Whoosh sound (white noise with filter sweep)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 1;
      filter.frequency.setValueAtTime(4000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.5);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      noiseSource.start();

      // Magical chime (sine wave sweep)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
      
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2);

    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);
    setSmoke(true);
    playBlowSound();
    setTimeout(() => setSmoke(false), 3000);
  };

  const cakeX = useMotionValue(0);
  const cakeY = useMotionValue(0);
  const rotateX = useTransform(cakeY, [-150, 150], [8, -8]);
  const rotateY = useTransform(cakeX, [-150, 150], [-8, 8]);

  const handleCakeMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cakeX.set(e.clientX - rect.left - rect.width / 2);
    cakeY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleCakeLeave = () => {
    cakeX.set(0);
    cakeY.set(0);
  };

  return (
    <section className="relative py-32 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0908 0%, #1A1510 100%)', minHeight: '80vh' }}>
      
      <motion.div className="text-center mb-16 z-10"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <h2 className="font-serif tracking-tight mb-4"
          style={{ color: '#FFF8F0', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          Waktunya Tiup Lilin
        </h2>
        <p className="font-serif italic"
          style={{ color: 'rgba(212,165,116,0.8)', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>
          {blown ? "Harapanmu sudah didengar semesta." : "Tutup mata, buat harapan, lalu ketuk lilinnya..."}
        </p>
      </motion.div>

      {/* The Cake Scene */}
      <motion.div className="relative cursor-pointer group flex items-end justify-center w-full" onClick={handleBlow} 
        onMouseMove={handleCakeMove}
        onMouseLeave={handleCakeLeave}
        style={{ height: 'clamp(250px, 40vh, 350px)', perspective: 1000 }}>
        <motion.div className="relative" style={{ 
          width: 280, height: 300, 
          transformOrigin: 'bottom center',
          scale: 'clamp(0.7, 80vw / 280, 1.2)',
          rotateX, rotateY, transformStyle: 'preserve-3d'
        }}>
        
        {/* Glow ambient breathing */}
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD}15 0%, transparent 60%)`, filter: 'blur(30px)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating magic sparkles around the cake */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div key={`sparkle-${i}`} className="absolute pointer-events-none"
            style={{
              width: 4 + Math.random() * 4, height: 4 + Math.random() * 4,
              left: `${-50 + Math.random() * 200}%`,
              top: `${-20 + Math.random() * 120}%`,
              backgroundColor: i % 2 === 0 ? '#D4A574' : '#F5E6D3',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(212,165,116,0.5)',
            }}
            animate={{
              y: [0, -30 - Math.random() * 30],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none transition-opacity duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(212,165,116,0.3) 0%, transparent 60%)',
            opacity: blown ? 0 : 1,
            filter: 'blur(20px)',
          }} />

        {/* Cake Base */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2" style={{ width: 200, height: 120 }}>
          {/* Cake shadow */}
          <div className="absolute -bottom-4 left-0 w-full h-10 rounded-[100px/20px]" style={{ background: 'rgba(26,22,20,0.1)', filter: 'blur(4px)' }} />
          
          {/* Bottom tier */}
          <div className="absolute bottom-0 left-0 w-full h-16 rounded-[100px/20px]" style={{ background: '#F5E6D3', boxShadow: 'inset 0 -5px 15px rgba(212,165,116,0.2)' }} />
          <div className="absolute bottom-14 left-0 w-full h-8 rounded-[100px/20px]" style={{ background: '#FFFDF9' }} />
          
          {/* Top tier */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[140px] h-14 rounded-[70px/15px]" style={{ background: '#FAF0E6', boxShadow: 'inset 0 -5px 10px rgba(212,165,116,0.1)' }} />
          <div className="absolute bottom-[4.5rem] left-1/2 -translate-x-1/2 w-[140px] h-7 rounded-[70px/15px]" style={{ background: '#FFFDF9' }} />

          {/* Frosting drips */}
          <svg className="absolute bottom-12 left-0 w-full h-6" viewBox="0 0 200 24" fill="#FFFDF9">
            <path d="M0,0 Q10,15 20,5 Q30,20 40,8 Q50,24 60,10 Q70,18 80,6 Q90,22 100,12 Q110,24 120,8 Q130,16 140,5 Q150,20 160,8 Q170,18 180,6 Q190,15 200,0 Z" />
          </svg>
        </div>

        {/* Candle */}
        <div className="absolute bottom-[130px] left-1/2 -translate-x-1/2" style={{ width: 12, height: 40 }}>
          <div className="w-full h-full rounded-sm" style={{ background: 'linear-gradient(to right, #f2f2f2, #d9d9d9)' }}>
            {/* Stripes */}
            <div className="absolute top-2 w-full h-2 bg-[#E8C4C4] rotate-12" />
            <div className="absolute top-6 w-full h-2 bg-[#E8C4C4] rotate-12" />
          </div>
          {/* Wick */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-[#4a4a4a]" />

          {/* Flame */}
          <AnimatePresence>
            {!blown && (
              <motion.div className="absolute -top-10 left-1/2 -translate-x-1/2 w-4 h-8"
                style={{ originY: 1 }}
                animate={{
                  scale: [1, 1.1, 0.9, 1.05, 1],
                  rotate: [-2, 3, -1, 2, -2],
                  skewX: [-2, 2, -1, 1, -2],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}>
                <div className="w-full h-full rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
                  style={{
                    background: 'linear-gradient(to top, #ff9d00, #ffeb3b, rgba(255,255,255,0))',
                    boxShadow: '0 0 15px #ff9d00, 0 0 30px #ffeb3b',
                  }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smoke */}
          <AnimatePresence>
            {smoke && (
              <motion.div className="absolute -top-14 left-1/2 -translate-x-1/2 w-8 h-20 pointer-events-none"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.6, 0], y: -50, x: [0, -10, 10, -5] }}
                transition={{ duration: 2.5, ease: 'easeOut' }}
                exit={{ opacity: 0 }}>
                <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, rgba(100,100,100,0.2) 0%, transparent 70%)', filter: 'blur(5px)' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confetti Explosion on Blow */}
        <AnimatePresence>
          {blown && Array.from({ length: 30 }).map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const dist = 60 + Math.random() * 100;
            return (
              <motion.div key={i} className="absolute pointer-events-none"
                style={{
                  top: '40%', left: '50%',
                  width: 4 + Math.random() * 4, height: 8 + Math.random() * 6,
                  backgroundColor: i % 3 === 0 ? '#D4A574' : i % 3 === 1 ? '#E8C4C4' : '#F5E6D3',
                  borderRadius: i % 2 === 0 ? '50%' : '2px',
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist + 50, // falls down slightly
                  opacity: 0,
                  scale: 1,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
              />
            );
          })}
        </AnimatePresence>
        </motion.div>
      </motion.div>

    </section>
  );
}
