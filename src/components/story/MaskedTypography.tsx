'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface MaskedTypographyProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function MaskedTypography({
  text,
  className = '',
  delay = 0,
}: MaskedTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const textEl = containerRef.current.querySelector('.mt-text');
      const line = containerRef.current.querySelector('.mt-line');

      if (textEl) {
        gsap.fromTo(
          textEl,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: 'power3.out',
            duration: 1.4,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 78%',
              end: 'top 40%',
              scrub: 1.2,
            },
            delay,
          }
        );
      }

      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 42%',
              end: 'top 25%',
              scrub: 1,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <p className="mt-text" style={{ willChange: 'transform, opacity' }}>
        {text}
      </p>
      <span
        className="mt-line block mt-8 sm:mt-10 mx-auto h-px w-16 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.5) 30%, rgba(212,165,116,0.5) 70%, transparent)',
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}
