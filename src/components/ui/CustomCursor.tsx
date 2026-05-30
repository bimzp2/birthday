'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isPointer = window.getComputedStyle(target).cursor === 'pointer' || target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button';
      setIsHovering(isPointer);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hide on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Ambient Flashlight */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9990] mix-blend-screen"
        style={{ 
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.08) 0%, rgba(212, 165, 116, 0.02) 40%, transparent 70%)',
        }}
        animate={{ 
          x: mousePos.x - 300, 
          y: mousePos.y - 300,
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
      />
      
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[10000] mix-blend-screen"
        style={{ background: '#D4A574', boxShadow: '0 0 10px #D4A574' }}
        animate={{ 
          x: mousePos.x - 8, 
          y: mousePos.y - 8,
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 40, mass: 0.1 }}
      />
      
      {/* Expanding Ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full border pointer-events-none z-[9999]"
        style={{ borderColor: 'rgba(212, 165, 116, 0.5)' }}
        animate={{ 
          x: mousePos.x - 24, 
          y: mousePos.y - 24,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(212, 165, 116, 0.1)' : 'transparent'
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.5 }}
      />
    </>
  );
}
