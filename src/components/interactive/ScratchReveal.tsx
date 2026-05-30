'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const GOLD = '#D4A574';
const CREAM = '#FFF8F0';

export default function ScratchReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Canvas setup
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Fill top layer with frosted dark glass / stardust look
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#2A1F1A'); 
    gradient.addColorStop(0.5, '#1A120E');
    gradient.addColorStop(1, '#0A0908');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add some noise/texture to the scratch layer
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 2, 2);
    }
    
    // Add text on the scratch layer
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Gosok perlahan...', rect.width / 2, rect.height / 2);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 40;

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    let scratchedPixels = 0;
    const totalPixels = rect.width * rect.height;

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault(); // Prevent scrolling while scratching
      const pos = getMousePos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      // Check how much is scratched (rough estimation via bounding box or just counting calls)
      scratchedPixels += 500; 
      if (scratchedPixels > totalPixels * 0.4 && !isRevealed) {
        setIsRevealed(true);
        // Fade out canvas smoothly
        canvas.style.transition = 'opacity 2s ease-in-out';
        canvas.style.opacity = '0';
        setTimeout(() => {
          canvas.style.display = 'none';
        }, 2000);
      }
    };

    const handleDown = (e: MouseEvent | TouchEvent) => {
      isDrawing.current = true;
      const pos = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const handleUp = () => { isDrawing.current = false; };

    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', handleUp);
    canvas.addEventListener('touchstart', handleDown, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', handleUp);

    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mousemove', scratch);
      window.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('touchstart', handleDown);
      canvas.removeEventListener('touchmove', scratch);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isRevealed]);

  // 3D Tilt Logic
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useTransform(tiltY, [-250, 250], [6, -6]);
  const rotateY = useTransform(tiltX, [-250, 250], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    tiltX.set(e.clientX - rect.left - rect.width / 2);
    tiltY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section className="relative py-32 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(to top, #1A1510 0%, #0A0908 100%)', minHeight: '80vh' }}>
      
      <div className="text-center mb-12">
        <h2 className="font-serif tracking-[-0.02em] mb-4 text-3xl sm:text-4xl" style={{ color: '#FFF8F0', fontWeight: 300 }}>
          Kenangan Tersembunyi
        </h2>
        <p className="font-serif italic text-lg" style={{ color: `${GOLD}90` }}>
          Sesuatu yang spesial ada di baliknya
        </p>
      </div>

      <motion.div ref={containerRef} className="relative rounded-2xl overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          background: 'rgba(20, 15, 12, 0.4)', 
          backdropFilter: 'blur(60px) saturate(150%)', 
          WebkitBackdropFilter: 'blur(60px) saturate(150%)',
          border: `1px solid rgba(212, 165, 116, 0.1)`,
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 40px rgba(212,165,116,0.05)',
          width: 'min(85vw, 55vh, 400px)', 
          height: 'min(113vw, 73vh, 533px)',
          rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000
        }}>
        
        {/* The hidden content */}
        <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center"
          style={{ background: 'transparent' }}>
          <h3 className="font-serif text-2xl mb-6" style={{ color: '#FFF8F0' }}>
            Kamu adalah kejutan<br />terbaik dalam hidupku
          </h3>
          <p className="font-serif text-lg leading-relaxed" style={{ color: '#F5E6D3', opacity: 0.8 }}>
            Dulu aku nggak pernah tahu kalau aku akan bertemu seseorang yang bisa membuat dunia jadi seindah ini.
          </p>
        </div>

        {/* The scratchable layer */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
        />
        
        {/* Glow effect when revealed */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div 
              className="absolute inset-0 pointer-events-none z-20"
              initial={{ opacity: 0, boxShadow: `inset 0 0 0px ${GOLD}` }}
              animate={{ opacity: 1, boxShadow: `inset 0 0 40px ${GOLD}60` }}
              transition={{ duration: 1.5 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
