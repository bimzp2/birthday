'use client';

import { useEffect, useRef } from 'react';

const HEART_COLORS = [
  'rgba(230, 60, 80, 0.5)',
  'rgba(200, 40, 60, 0.45)',
  'rgba(255, 100, 130, 0.4)',
  'rgba(212, 165, 116, 0.3)',
  'rgba(240, 90, 110, 0.35)',
  'rgba(255, 160, 180, 0.25)',
  'rgba(180, 30, 50, 0.4)',
];

interface Heart {
  x: number; y: number;
  size: number; speed: number;
  opacity: number; targetOpacity: number;
  swayAmp: number; swayFreq: number;
  rotation: number; rotationSpeed: number;
  color: string; phase: number;
  trail: { x: number; y: number; opacity: number }[];
  pulsePhase: number; pulseSpeed: number;
  sparkle: boolean;
}

const HEART_COUNT = 35;

function createHeart(w: number, h: number, bottom = true): Heart {
  const size = 6 + Math.random() * 18;
  return {
    x: Math.random() * w,
    y: bottom ? h + 20 + Math.random() * 80 : Math.random() * h,
    size,
    speed: 0.2 + Math.random() * 0.55,
    opacity: 0,
    targetOpacity: 0.04 + Math.random() * 0.18,
    swayAmp: 12 + Math.random() * 35,
    swayFreq: 0.002 + Math.random() * 0.007,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.01,
    color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    phase: Math.random() * Math.PI * 2,
    trail: [],
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.03 + Math.random() * 0.05,
    sparkle: Math.random() > 0.7,
  };
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3);
  ctx.bezierCurveTo(x - size * 0.5, y + size * 0.65, x, y + size * 0.85, x, y + size);
  ctx.bezierCurveTo(x, y + size * 0.85, x + size * 0.5, y + size * 0.65, x + size * 0.5, y + size * 0.3);
  ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.3);
  ctx.closePath();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
}

export default function HeartParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<Heart[]>([]);
  const rafRef    = useRef<number>(0);
  const timeRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    heartsRef.current = Array.from({ length: HEART_COUNT }, () =>
      createHeart(window.innerWidth, window.innerHeight, false)
    );

    const animate = () => {
      timeRef.current += 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const heart of heartsRef.current) {
        heart.y -= heart.speed;
        heart.rotation += heart.rotationSpeed;
        heart.pulsePhase += heart.pulseSpeed;

        // Smooth opacity fade in
        heart.opacity += (heart.targetOpacity - heart.opacity) * 0.04;

        const swayX = Math.sin(timeRef.current * heart.swayFreq + heart.phase) * heart.swayAmp;
        const pulse = 1 + Math.sin(heart.pulsePhase) * 0.08;

        // Trail
        heart.trail.push({ x: heart.x + swayX, y: heart.y, opacity: heart.opacity * 0.4 });
        if (heart.trail.length > 6) heart.trail.shift();

        if (heart.y < -heart.size * 3) {
          Object.assign(heart, createHeart(w, h, true));
          heart.trail = [];
        }

        // Draw trail
        heart.trail.forEach((pt, i) => {
          const a = (i / heart.trail.length) * pt.opacity * 0.5;
          if (a < 0.005) return;
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(heart.rotation);
          ctx.globalAlpha = a;
          ctx.fillStyle = heart.color;
          drawHeart(ctx, 0, -heart.size * 0.4 * pulse, heart.size * 0.5 * (i / heart.trail.length));
          ctx.fill();
          ctx.restore();
        });

        // Draw heart
        ctx.save();
        ctx.translate(heart.x + swayX, heart.y);
        ctx.rotate(heart.rotation);
        ctx.globalAlpha = heart.opacity;
        ctx.fillStyle = heart.color;
        drawHeart(ctx, 0, -heart.size * 0.5 * pulse, heart.size * pulse);
        ctx.fill();

        // Glow simulated without expensive shadowBlur
        if (heart.opacity > 0.08) {
          ctx.globalAlpha = heart.opacity * 0.15;
          drawHeart(ctx, 0, -heart.size * 0.5 * pulse, heart.size * pulse * 1.6);
          ctx.fill();
        }

        // Sparkle cross
        if (heart.sparkle && timeRef.current % 4 === 0) {
          ctx.globalAlpha = heart.opacity * 0.6;
          ctx.strokeStyle = 'rgba(255,220,230,0.5)';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          drawStar(ctx, 0, -heart.size * 1.2, heart.size * 0.4);
          ctx.stroke();
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 30 }}
      aria-hidden="true"
    />
  );
}
