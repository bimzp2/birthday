'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TRAIL_COLORS = ['#D4A574', '#E8C4C4', '#F5E6D3', '#FF88A0', '#FFD700'];

export default function CustomCursor() {
  const [isHover, setIsHover]     = useState(false);
  const [isClick, setIsClick]     = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clickPos, setClickPos]   = useState({ x: -100, y: -100 });
  const [clickKey, setClickKey]   = useState(0);

  // Performance optimization: Use motion values instead of React state for mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for different cursor layers
  const smoothX = useSpring(mouseX, { stiffness: 1200, damping: 45, mass: 0.08 });
  const smoothY = useSpring(mouseY, { stiffness: 1200, damping: 45, mass: 0.08 });

  const ringX = useSpring(mouseX, { stiffness: 140, damping: 18, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 140, damping: 18, mass: 0.6 });

  const outerX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 1.2 });
  const outerY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 1.2 });

  // Transforms to offset the centers
  const dotX = useTransform(smoothX, v => v - 5);
  const dotY = useTransform(smoothY, v => v - 5);

  const ringOffsetX = useTransform(ringX, v => v - 18);
  const ringOffsetY = useTransform(ringY, v => v - 18);

  const outerOffsetX = useTransform(outerX, v => v - 32);
  const outerOffsetY = useTransform(outerY, v => v - 32);

  const lightX = useTransform(mouseX, v => v - 350);
  const lightY = useTransform(mouseY, v => v - 350);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setIsVisible(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const t = e.target as HTMLElement;
      const isPtr = window.getComputedStyle(t).cursor === 'pointer'
        || t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('button') !== null || t.closest('a') !== null;
      
      // Only trigger state update if changed to prevent re-renders
      setIsHover(prev => prev !== isPtr ? isPtr : prev);
    };

    const onDown = (e: MouseEvent) => {
      setIsClick(true);
      setClickPos({ x: e.clientX, y: e.clientY });
      setClickKey(k => k + 1);
    };
    const onUp = () => setIsClick(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Ambient flashlight */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9985] mix-blend-screen"
        style={{
          width: 700, height: 700, x: lightX, y: lightY,
          background: 'radial-gradient(circle, rgba(212,165,116,0.05) 0%, rgba(232,196,196,0.02) 35%, transparent 65%)',
          borderRadius: '50%', willChange: 'transform',
        }}
      />

      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-screen"
        style={{
          width: 10, height: 10, x: dotX, y: dotY,
          background: isHover ? '#FF88A0' : '#D4A574',
          boxShadow: `0 0 ${isClick ? 20 : 10}px ${isHover ? '#FF88A0' : '#D4A574'}`,
          willChange: 'transform',
        }}
        animate={{ scale: isClick ? 0.5 : isHover ? 0 : 1, opacity: isHover ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 1200, damping: 45, mass: 0.08 }}
      />

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          width: 36, height: 36, x: ringOffsetX, y: ringOffsetY,
          border: `1.5px solid ${isHover ? 'rgba(255,136,160,0.6)' : 'rgba(212,165,116,0.45)'}`,
          background: isHover ? 'rgba(255,136,160,0.08)' : 'transparent',
          willChange: 'transform',
        }}
        animate={{ scale: isClick ? 0.8 : isHover ? 1.7 : 1, opacity: isHover ? 0.9 : 0.7 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18, mass: 0.6 }}
      />

      {/* Outer ring (slow follower) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9990] rounded-full"
        style={{ width: 64, height: 64, x: outerOffsetX, y: outerOffsetY, border: '0.5px solid rgba(212,165,116,0.18)', willChange: 'transform' }}
        animate={{ scale: isHover ? 0.6 : 1 }}
      />

      {/* Click ripple */}
      <AnimatePresence>
        {isClick && (
          <motion.div key={clickKey}
            className="fixed top-0 left-0 pointer-events-none z-[9995] rounded-full"
            style={{ width: 36, height: 36, border: '1px solid rgba(212,165,116,0.5)', left: clickPos.x - 18, top: clickPos.y - 18 }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
