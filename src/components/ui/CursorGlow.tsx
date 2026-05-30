'use client';

import { useEffect, useRef } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useIsMobile } from '@/hooks/useMediaQuery';

export default function CursorGlow() {
  const { x, y } = useMousePosition();
  const isMobile = useIsMobile();
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) return;

    let animationId: number;
    const animate = () => {
      posRef.current.x += (x - posRef.current.x) * 0.08;
      posRef.current.y += (y - posRef.current.y) * 0.08;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${posRef.current.x - 60}px, ${posRef.current.y - 60}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [x, y, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Main cursor glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.15) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      {/* Trailing soft glow */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-30 h-30 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(232, 196, 196, 0.06) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
