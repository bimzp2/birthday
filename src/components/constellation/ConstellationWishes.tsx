'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ConstellationWishes — A dreamy dark sky where users connect stars to reveal hidden wishes.
 */

interface Star {
  id: number;
  x: number;
  y: number;
  group: number; // which constellation it belongs to
}

interface Constellation {
  id: number;
  name: string;
  wish: string;
  stars: number[]; // star IDs
}

const STARS: Star[] = [
  // Constellation 1: "The Heart" (5 stars)
  { id: 0, x: 18, y: 30, group: 0 },
  { id: 1, x: 25, y: 22, group: 0 },
  { id: 2, x: 32, y: 30, group: 0 },
  { id: 3, x: 25, y: 42, group: 0 },
  { id: 4, x: 25, y: 35, group: 0 },
  // Constellation 2: "The Star" (4 stars)
  { id: 5, x: 55, y: 25, group: 1 },
  { id: 6, x: 62, y: 18, group: 1 },
  { id: 7, x: 69, y: 25, group: 1 },
  { id: 8, x: 62, y: 35, group: 1 },
  // Constellation 3: "The Dream" (5 stars)
  { id: 9, x: 40, y: 58, group: 2 },
  { id: 10, x: 48, y: 52, group: 2 },
  { id: 11, x: 56, y: 58, group: 2 },
  { id: 12, x: 52, y: 68, group: 2 },
  { id: 13, x: 44, y: 68, group: 2 },
];

const CONSTELLATIONS: Constellation[] = [
  { id: 0, name: 'Hati', stars: [0, 1, 2, 3, 4], wish: 'Semoga kamu selalu dikelilingi orang-orang yang tulus sayang sama kamu.' },
  { id: 1, name: 'Bintang', stars: [5, 6, 7, 8], wish: 'Semoga di saat kamu ngerasa gelap, selalu ada jalan terang buat kamu.' },
  { id: 2, name: 'Mimpi', stars: [9, 10, 11, 12, 13], wish: 'Semoga semua hal baik yang lagi kamu usahain sekarang bisa cepet terwujud ya.' },
];

export default function ConstellationWishes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [revealedConstellations, setRevealedConstellations] = useState<Set<number>>(new Set());
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Background star field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const bgStars = Array.from({ length: 150 }, () => ({
      x: Math.random(), y: Math.random(),
      size: 0.3 + Math.random() * 1.5,
      twinkleSpeed: 0.5 + Math.random() * 2,
      twinklePhase: Math.random() * Math.PI * 2,
      baseOpacity: 0.1 + Math.random() * 0.4,
    }));

    let time = 0;
    let animId: number;
    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of bgStars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        const alpha = star.baseOpacity * twinkle;
        ctx.beginPath();
        ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,230,211,${alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const handleStarClick = useCallback((starId: number) => {
    if (selectedStar === null) {
      setSelectedStar(starId);
    } else if (selectedStar === starId) {
      setSelectedStar(null);
    } else {
      // Connect the two stars
      const key = [Math.min(selectedStar, starId), Math.max(selectedStar, starId)].join('-');
      const newConnections = new Set(connections);
      newConnections.add(key);
      setConnections(newConnections);
      setSelectedStar(null);

      // Check constellations
      for (const c of CONSTELLATIONS) {
        if (revealedConstellations.has(c.id)) continue;
        const groupStars = STARS.filter(s => c.stars.includes(s.id));
        let allConnected = true;
        for (let i = 0; i < groupStars.length; i++) {
          for (let j = i + 1; j < groupStars.length; j++) {
            // Only check adjacent pairs
          }
        }
        // Simplified: if at least (stars-1) connections exist within group, reveal
        let groupConnCount = 0;
        for (const conn of newConnections) {
          const [a, b] = conn.split('-').map(Number);
          if (c.stars.includes(a) && c.stars.includes(b)) groupConnCount++;
        }
        if (groupConnCount >= c.stars.length - 1) {
          allConnected = true;
          setRevealedConstellations(prev => new Set([...prev, c.id]));
        }
      }
    }
  }, [selectedStar, connections, revealedConstellations]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0908 0%, #12101a 30%, #1a1520 50%, #12101a 70%, #0A0908 100%)',
        minHeight: '80vh',
        padding: 'clamp(3rem, 6vw, 6rem) 0',
      }}>

      {/* Canvas star field */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Cosmic dust */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 40%, rgba(212,165,116,0.03) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(232,196,196,0.02) 0%, transparent 50%)',
        }} />

      {/* Heading */}
      <motion.div className="text-center mb-10 sm:mb-14 px-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
        <h2 className="font-serif tracking-[-0.02em] mb-3"
          style={{ color: '#FFF8F0', fontWeight: 300, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
          Harapan yang Tertulis di Bintang
        </h2>
        <p className="font-serif italic"
          style={{ color: 'rgba(245,230,211,0.4)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>
          hubungkan bintang-bintang untuk mengungkap harapan tersembunyi
        </p>
        <div className="mx-auto mt-4 h-px w-12 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.3), transparent)' }} />

        {/* Counter */}
        <p className="mt-4" style={{ color: 'rgba(212,165,116,0.5)', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
          {revealedConstellations.size} / 3 harapan ditemukan
        </p>
      </motion.div>

      {/* Interactive star area */}
      <div className="relative max-w-4xl mx-auto px-4" style={{ minHeight: '45vh' }}>
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]">
          {Array.from(connections).map((key) => {
            const [aId, bId] = key.split('-').map(Number);
            const a = STARS.find(s => s.id === aId);
            const b = STARS.find(s => s.id === bId);
            if (!a || !b) return null;
            return (
              <motion.line
                key={key}
                x1={`${a.x}%`} y1={`${a.y}%`}
                x2={`${b.x}%`} y2={`${b.y}%`}
                stroke="#D4A574"
                strokeWidth="1"
                opacity="0.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}
        </svg>

        {/* Stars */}
        {STARS.map((star) => {
          const isSelected = selectedStar === star.id;
          const isRevealed = revealedConstellations.has(star.group);
          return (
            <motion.button
              key={star.id}
              className="absolute z-10 cursor-pointer"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleStarClick(star.id)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: star.id * 0.08, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${isRevealed ? 'rgba(212,165,116,0.5)' : isSelected ? 'rgba(212,165,116,0.4)' : 'rgba(245,230,211,0.2)'} 0%, transparent 70%)`,
                    filter: 'blur(4px)',
                    transition: 'background 0.5s',
                  }} />
                {/* Core */}
                <div className="relative w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                  style={{
                    background: isRevealed ? '#D4A574' : isSelected ? '#F5E6D3' : '#E8C4C4',
                    boxShadow: `0 0 ${isSelected ? 12 : 6}px ${isRevealed ? '#D4A574' : '#E8C4C4'}`,
                    transition: 'all 0.5s',
                  }} />
                {/* Pulse ring when selected */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: '1px solid rgba(212,165,116,0.4)' }}
                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}

        {/* Revealed wishes */}
        <AnimatePresence>
          {Array.from(revealedConstellations).map((cId) => {
            const c = CONSTELLATIONS.find(cc => cc.id === cId);
            if (!c) return null;
            const avgX = c.stars.reduce((sum, id) => sum + (STARS.find(s => s.id === id)?.x || 0), 0) / c.stars.length;
            const avgY = c.stars.reduce((sum, id) => sum + (STARS.find(s => s.id === id)?.y || 0), 0) / c.stars.length;
            return (
              <motion.div
                key={cId}
                className="absolute z-20 text-center px-6 py-4 pointer-events-none max-w-xs"
                style={{ left: `${avgX}%`, top: `${avgY + 12}%`, transform: 'translateX(-50%)' }}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-serif mb-1"
                  style={{ color: '#D4A574', fontSize: 'clamp(0.6rem, 0.9vw, 0.7rem)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {c.name}
                </p>
                <p className="font-serif italic"
                  style={{ color: 'rgba(255,248,240,0.8)', fontSize: 'clamp(0.8rem, 1.3vw, 1rem)', lineHeight: 1.5 }}>
                  {c.wish}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
