'use client';

import { motion } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';
import { useRef, useState } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  magnetic?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function GlassButton({
  children,
  onClick,
  className = '',
  magnetic = false,
  size = 'md',
}: GlassButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-10 py-3.5 text-base',
    lg: 'px-14 py-5 text-lg',
  };

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    setMagneticOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: magneticOffset.x,
        y: magneticOffset.y,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 40px rgba(212, 165, 116, 0.25), 0 0 80px rgba(212, 165, 116, 0.1)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className={`
        relative overflow-hidden rounded-full
        font-serif tracking-[0.2em] uppercase
        cursor-pointer select-none
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        background: 'rgba(255, 248, 240, 0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 165, 116, 0.2)',
        color: '#F5E6D3',
        boxShadow: '0 0 20px rgba(212, 165, 116, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      <span className="relative z-10">{children}</span>
      {/* Bloom effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          background: 'radial-gradient(circle at center, rgba(212, 165, 116, 0.15), transparent 70%)',
        }}
      />
    </motion.button>
  );
}
