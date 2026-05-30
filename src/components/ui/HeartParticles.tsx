'use client';

import { useEffect, useRef } from 'react';

/* ── Heart colors ── */
const HEART_COLORS = [
  'rgba(230, 60, 80, 0.45)',    // bright red
  'rgba(200, 40, 60, 0.4)',     // deep red
  'rgba(255, 100, 120, 0.35)',  // soft red
  'rgba(212, 165, 116, 0.25)',  // gold
  'rgba(240, 80, 100, 0.3)',    // pinkish red
];

interface Heart {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  swayAmp: number;
  swayFreq: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  phase: number;
}

const HEART_COUNT = 45;

function createHeart(canvasW: number, canvasH: number, startAtBottom = true): Heart {
  return {
    x: Math.random() * canvasW,
    y: startAtBottom ? canvasH + 20 + Math.random() * 100 : Math.random() * canvasH,
    size: 6 + Math.random() * 14,
    speed: 0.25 + Math.random() * 0.5,
    opacity: 0.06 + Math.random() * 0.14,
    swayAmp: 15 + Math.random() * 30,
    swayFreq: 0.003 + Math.random() * 0.006,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.008,
    color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    phase: Math.random() * Math.PI * 2,
  };
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const w = size;
  const h = size;
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.3);
  ctx.bezierCurveTo(x, y, x - w * 0.5, y, x - w * 0.5, y + h * 0.3);
  ctx.bezierCurveTo(x - w * 0.5, y + h * 0.6, x, y + h * 0.8, x, y + h);
  ctx.bezierCurveTo(x, y + h * 0.8, x + w * 0.5, y + h * 0.6, x + w * 0.5, y + h * 0.3);
  ctx.bezierCurveTo(x + w * 0.5, y, x, y, x, y + h * 0.3);
  ctx.closePath();
}

export default function HeartParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<Heart[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    /* Init hearts spread across canvas */
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

        const swayX = Math.sin(timeRef.current * heart.swayFreq + heart.phase) * heart.swayAmp;

        /* Reset when above viewport */
        if (heart.y < -heart.size * 2) {
          Object.assign(heart, createHeart(w, h, true));
        }

        ctx.save();
        ctx.translate(heart.x + swayX, heart.y);
        ctx.rotate(heart.rotation);
        ctx.globalAlpha = heart.opacity;
        ctx.fillStyle = heart.color;

        drawHeart(ctx, 0, -heart.size / 2, heart.size);
        ctx.fill();
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 30 }}
      aria-hidden="true"
    />
  );
}
