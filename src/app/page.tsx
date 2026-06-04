'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { SceneManager, useScene } from '@/components/providers/SceneManager';
import { AudioProvider, useAudio } from '@/components/providers/AudioProvider';
import SmoothScroll from '@/components/providers/SmoothScroll';
import FlowerLoader from '@/components/loading/FlowerLoader';
import CinematicIntro from '@/components/intro/CinematicIntro';
import PasscodeScreen from '@/components/passcode/PasscodeScreen';
import PasscodeTransition from '@/components/passcode/PasscodeTransition';
import StorySection from '@/components/story/StorySection';
import HandwrittenLetter from '@/components/letter/HandwrittenLetter';
import ImageCarousel from '@/components/gallery/ImageCarousel';
import HeartParticles from '@/components/ui/HeartParticles';
import HeartReveal from '@/components/ui/HeartReveal';
import EnvelopeReveal from '@/components/ui/EnvelopeReveal';
import MemoryGarden from '@/components/garden/MemoryGarden';
import ConstellationWishes from '@/components/constellation/ConstellationWishes';
import EternalEnding from '@/components/ending/EternalEnding';

import BreathingHeart from '@/components/hero/BreathingHeart';
import InteractiveCake from '@/components/cake/InteractiveCake';
import InteractiveBook from '@/components/book/InteractiveBook';
import TransitionOverlay from '@/components/ui/TransitionOverlay';
import ScratchReveal from '@/components/interactive/ScratchReveal';
import LanternSky from '@/components/interactive/LanternSky';

/* ═══════════════════════════════════════════════════════
   Hero corner floral SVGs
   ═══════════════════════════════════════════════════════ */
function HeroFloral({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const classes: Record<string, string> = {
    tl: '-top-2 -left-2',
    tr: '-top-2 -right-2 scale-x-[-1]',
    bl: '-bottom-2 -left-2 scale-y-[-1]',
    br: '-bottom-2 -right-2 scale-[-1]',
  };
  return (
    <svg className={`pointer-events-none absolute w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 ${classes[pos]}`}
      style={{ opacity: 0.05 }} viewBox="0 0 200 200" fill="none">
      <path d="M25 175 Q35 120 55 85 Q75 55 115 35 Q135 25 165 20" stroke="#D4A574" strokeWidth="1" fill="none" />
      <path d="M55 85 Q70 72 88 75" stroke="#D4A574" strokeWidth="0.7" fill="none" />
      <path d="M85 60 Q95 48 110 50" stroke="#D4A574" strokeWidth="0.7" fill="none" />
      {[0,72,144,216,288].map((a,i) => (
        <ellipse key={i} cx="155" cy="18" rx="5.5" ry="10" fill="#F2D5D0" opacity={0.45+i*0.05} transform={`rotate(${a} 155 26)`} />
      ))}
      <circle cx="155" cy="26" r="2.5" fill="#D4A574" opacity="0.35" />
      <ellipse cx="84" cy="72" rx="7" ry="2.5" fill="#D4A574" opacity="0.2" transform="rotate(-25 84 72)" />
      <ellipse cx="106" cy="48" rx="6" ry="2" fill="#D4A574" opacity="0.18" transform="rotate(-15 106 48)" />
      <ellipse cx="40" cy="140" rx="4" ry="7" fill="#E8C4C4" opacity="0.2" transform="rotate(10 40 140)" />
      <ellipse cx="120" cy="34" rx="3" ry="5" fill="#F2D5D0" opacity="0.2" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Section divider with floral motif
   ═══════════════════════════════════════════════════════ */
function FloralDivider() {
  return (
    <div className="flex items-center justify-center py-6 px-8">
      <div className="h-px flex-grow max-w-[80px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.2))' }} />
      <div className="mx-4 w-8 h-8 opacity-[0.12]">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          {[0,72,144,216,288].map((a,i) => (
            <ellipse key={i} cx="20" cy="8" rx="4" ry="8" fill="#D4A574" opacity={0.5} transform={`rotate(${a} 20 20)`} />
          ))}
          <circle cx="20" cy="20" r="2" fill="#D4A574" opacity="0.4" />
        </svg>
      </div>
      <div className="h-px flex-grow max-w-[80px]"
        style={{ background: 'linear-gradient(270deg, transparent, rgba(212,165,116,0.2))' }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   App Inner
   ═══════════════════════════════════════════════════════ */
function AppInner() {
  const { scene, transitionTo } = useScene();
  const { togglePlay, isPlaying } = useAudio();
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 3200;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min(((ts - start) / duration) * 100, 100);
      setLoadProgress(progress);
      if (progress < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleLoadComplete = useCallback(() => transitionTo('intro'), [transitionTo]);
  const handleBegin = useCallback(() => {
    transitionTo('passcode');
  }, [transitionTo]);
  const handlePasscodeSuccess = useCallback(() => {
    if (!isPlaying) togglePlay();
    transitionTo('transition');
  }, [transitionTo, isPlaying, togglePlay]);
  const handleTransitionComplete = useCallback(() => transitionTo('main'), [transitionTo]);

  return (
    <>
      <TransitionOverlay />
      
      <AnimatePresence>
        {scene === 'loading' && (
          <motion.div key="loading" exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
            <FlowerLoader progress={loadProgress} onComplete={handleLoadComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scene === 'intro' && (
          <motion.div key="intro" className="fixed inset-0 z-40"
            exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <CinematicIntro onBegin={handleBegin} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scene === 'passcode' && (
          <motion.div key="passcode" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <PasscodeScreen onSuccess={handlePasscodeSuccess} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scene === 'transition' && (
          <motion.div key="transition" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <PasscodeTransition onComplete={handleTransitionComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scene === 'main' && (
          <motion.div key="main"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}>

            <HeartParticles />

            {/* Film grain overlay */}
            <div className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.02]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
                backgroundSize: '2px 2px',
              }} />

            <SmoothScroll>
              {/* ═══════════════════════════════════════
                  HERO
                  ═══════════════════════════════════════ */}
              <section className="relative flex flex-col items-center justify-center overflow-hidden"
                style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0A0908 0%, #1A1614 45%, #2A2420 78%, #FFF8F0 100%)' }}>

                <div className="absolute inset-0 z-0 opacity-80 mt-10">
                  <BreathingHeart />
                </div>

                <div className="absolute inset-0 z-[1] pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(10,9,8,0.5) 75%)' }} />

                <HeroFloral pos="tl" />
                <HeroFloral pos="tr" />
                <HeroFloral pos="bl" />
                <HeroFloral pos="br" />

                <div className="relative z-10 text-center px-6 max-w-3xl">
                  {/* Pre-title tag */}
                  <motion.p className="tracking-[0.35em] uppercase mb-5 sm:mb-6"
                    style={{ color: 'rgba(212,165,116,0.55)', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(0.5rem, 1vw, 0.68rem)', letterSpacing: '0.4em' }}
                    initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.2, delay: 0.3 }}>
                    — a celebration of you —
                  </motion.p>

                  {/* Main title */}
                  <motion.h1 className="font-serif"
                    style={{ color: '#FFF8F0', fontWeight: 300, fontSize: 'clamp(2.2rem, 5.5vw + 0.5rem, 6rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
                    initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                    Selamat Ulang Tahun,
                    <br />
                    <motion.span
                      className="inline-block mt-2"
                      style={{ color: '#D4A574', textShadow: '0 0 40px rgba(212,165,116,0.4)' }}
                      animate={{ textShadow: ['0 0 30px rgba(212,165,116,0.3)', '0 0 60px rgba(212,165,116,0.6)', '0 0 30px rgba(212,165,116,0.3)'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>Asa</motion.span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p className="font-serif mt-6 sm:mt-8"
                    style={{ color: 'rgba(245,230,211,0.5)', fontWeight: 300, fontSize: 'clamp(0.9rem, 1.7vw, 1.25rem)', lineHeight: 1.75 }}
                    initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.2, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}>
                    ada banyak hal baik yang pengen aku rayain bareng kamu
                  </motion.p>

                  {/* Animated divider */}
                  <motion.div className="mt-8 flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
                    <motion.div className="h-px"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.4))' }}
                      initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 1, delay: 1.6 }} />
                    <motion.div
                      animate={{ rotate: [0, 360] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                      style={{ opacity: 0.4 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 0 L5.8 4 L10 5 L5.8 6 L5 10 L4.2 6 L0 5 L4.2 4 Z" fill="#D4A574" />
                      </svg>
                    </motion.div>
                    <motion.div className="h-px"
                      style={{ background: 'linear-gradient(270deg, transparent, rgba(212,165,116,0.4))' }}
                      initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 1, delay: 1.6 }} />
                  </motion.div>

                  {/* Sparkle dots */}
                  {[{ x: -60, y: -30, d: 2 }, { x: 55, y: -40, d: 1.5 }, { x: -80, y: 20, d: 1.2 }, { x: 70, y: 15, d: 1.8 }].map((s, i) => (
                    <motion.div key={i} className="absolute rounded-full pointer-events-none"
                      style={{ width: s.d * 2, height: s.d * 2, background: '#D4A574', boxShadow: '0 0 6px #D4A574', left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)` }}
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
                      transition={{ duration: 2.5, delay: 1.8 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }} />
                  ))}

                  {/* Scroll indicator */}
                  <motion.div className="mt-20 sm:mt-28 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1.2 }}>
                    <span className="tracking-[0.3em] uppercase"
                      style={{ color: 'rgba(245,230,211,0.3)', fontFamily: "'Inter', sans-serif", fontSize: '0.48rem' }}>
                      scroll
                    </span>
                    <motion.div className="flex flex-col items-center gap-0.5"
                      animate={{ y: [0, 6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
                      <div className="w-px h-5" style={{ background: 'linear-gradient(to bottom, rgba(212,165,116,0.4), transparent)' }} />
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                        <path d="M1 1 L4 4 L7 1" stroke="rgba(212,165,116,0.4)" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              {/* Divider */}
              <div style={{ background: '#FFF8F0' }}>
                <FloralDivider />
              </div>

              {/* STORY */}
              <StorySection />

              {/* Heart animation transition */}
              <div style={{ background: '#FFF8F0' }}>
                <HeartReveal message="setiap momen, untukmu" />
              </div>

              {/* GALLERY */}
              <ImageCarousel />

              {/* Heart animation transition */}
              <div style={{ background: '#FFF8F0' }}>
                <HeartReveal message="dengan sepenuh hati" delay={0.2} />
              </div>

              {/* LETTER */}
              <HandwrittenLetter />

              {/* ═══════════════════════════════════════
                  GARDEN
                  ═══════════════════════════════════════ */}
              <div style={{ background: '#FFF8F0' }}>
                <EnvelopeReveal message="Terima kasih telah menjadi bagian paling indah dari ceritaku." subMessage="buka ini" delay={0.2} />
              </div>
              <MemoryGarden />

              <ConstellationWishes />

              {/* ═══════════════════════════════════════
                  NEW INTERACTIVE FEATURES
                  ═══════════════════════════════════════ */}
              <ScratchReveal />
              <LanternSky />

              {/* ═══════════════════════════════════════
                  CAKE
                  ═══════════════════════════════════════ */}
              <InteractiveCake />

              {/* ═══════════════════════════════════════
                  BOOK & CLOSING
                  ═══════════════════════════════════════ */}
              <InteractiveBook />
              <EternalEnding />
            </SmoothScroll>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Root
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <AudioProvider>
      <SceneManager>
        <AppInner />
      </SceneManager>
    </AudioProvider>
  );
}
