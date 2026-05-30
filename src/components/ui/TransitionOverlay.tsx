'use client';

import { useEffect, useRef } from 'react';
import { useScene } from '@/components/providers/SceneManager';

export default function TransitionOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scene } = useScene();
  const prevSceneRef = useRef(scene);
  const warpSpeedRef = useRef(0);

  useEffect(() => {
    // When scene changes, spike the warp speed
    if (scene !== prevSceneRef.current) {
      warpSpeedRef.current = 15; // Spike speed
      prevSceneRef.current = scene;
    }
  }, [scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles: { x: number, y: number, z: number }[] = Array.from({ length: 150 }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * 1000
    }));

    const render = () => {
      // Decay warp speed back to 0.1 (ambient) very smoothly
      warpSpeedRef.current += (0.1 - warpSpeedRef.current) * 0.02;

      // Draw background with slight trail effect based on speed
      ctx.fillStyle = `rgba(10, 9, 8, ${warpSpeedRef.current > 1 ? 0.15 : 1})`;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#F5E6D3'; // Champagne color

      for (const p of particles) {
        // Move particle towards camera
        p.z -= warpSpeedRef.current * 10;
        
        // Reset if behind camera
        if (p.z <= 0) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height * 2;
        }

        const scale = 500 / p.z;
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;
        
        // Calculate previous position to draw lines (trails) during warp
        const prevScale = 500 / (p.z + warpSpeedRef.current * 20);
        const prevPx = cx + p.x * prevScale;
        const prevPy = cy + p.y * prevScale;

        const size = Math.max(0.5, scale * 1.5);
        
        if (warpSpeedRef.current > 2) {
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = `rgba(245, 230, 211, ${scale})`;
          ctx.lineWidth = size;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0" 
      style={{ opacity: 0.8 }} 
    />
  );
}
