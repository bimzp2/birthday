'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { title: 'Senyum Pertama', subtitle: 'Saat segalanya berubah', photo: '/assets/photo-1.png' },
  { title: 'Senja Keemasan', subtitle: 'Ketika cahaya mengenaimu dengan sempurna', photo: '/assets/photo-2.png' },
  { title: 'Bersama', subtitle: 'Berdampingan, selalu', photo: '/assets/photo-3.png' },
  { title: 'Petualangan', subtitle: 'Setiap jalan membawaku padamu', photo: '/assets/photo-4.png' },
  { title: 'Tawa', subtitle: 'Suara yang tak pernah ku bosan dengar', photo: '/assets/photo-5.png' },
  { title: 'Selamanya', subtitle: 'Ini baru permulaan', photo: '/assets/photo-6.png' },
];

function TiltCard({ card }: { card: typeof CARDS[0] }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useTransform(y, [0, 1], [15, -15]);
  const rotateY = useTransform(x, [0, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div className="carousel-card snap-center shrink-0 group"
      style={{ minWidth: 'clamp(240px, 30vw, 340px)', perspective: '1000px', willChange: 'transform, opacity' }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{
          aspectRatio: '3/4',
          rotateX, rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: '0 6px 30px rgba(26,22,20,0.08), 0 2px 6px rgba(26,22,20,0.04)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
        
        {/* Photo with parallax push back */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(-20px)' }}>
          <img src={card.photo} alt={card.title} className="w-full h-full object-cover scale-105"
            style={{ filter: 'saturate(0.85) contrast(0.95) brightness(1.02)' }} />
        </div>

        {/* Warm overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, transparent 40%, rgba(26,22,20,0.45) 100%)' }} />

        {/* Bottom caption with parallax pop out */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pointer-events-none"
          style={{ transform: 'translateZ(40px)' }}>
          <h3 className="font-serif text-base sm:text-lg mb-0.5 drop-shadow-md" style={{ color: '#FFF8F0', fontWeight: 400 }}>
            {card.title}
          </h3>
          <p className="tracking-wide drop-shadow-md" style={{ color: 'rgba(255,248,240,0.8)', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(0.6rem, 1vw, 0.72rem)' }}>
            {card.subtitle}
          </p>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 60px rgba(212,165,116,0.06)' }} />
      </motion.div>
    </div>
  );
}

export default function ImageCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateIndicators = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateIndicators();
    el.addEventListener('scroll', updateIndicators, { passive: true });
    window.addEventListener('resize', updateIndicators);
    return () => { el.removeEventListener('scroll', updateIndicators); window.removeEventListener('resize', updateIndicators); };
  }, [updateIndicators]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.carousel-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 60, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } }
    );

    const heading = sectionRef.current.querySelector('.carousel-heading');
    if (heading) {
      gsap.fromTo(heading, { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', toggleActions: 'play none none reverse' } });
    }

    sectionRef.current.querySelectorAll('.gallery-deco').forEach((f) => {
      gsap.fromTo(f, { yPercent: 15 },
        { yPercent: -15, ease: 'none', scrollTrigger: { trigger: sectionRef.current!, start: 'top bottom', end: 'bottom top', scrub: 2 } });
    });
  }, { scope: sectionRef });

  const scrollTo = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 md:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FAF0E6 50%, #FFF8F0 100%)' }}>

      {/* Paper texture */}
      <div className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(212,165,116,0.02) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(26,22,20,0.005) 1px, transparent 1px)', backgroundSize: '100% 100%, 3px 3px' }} />

      {/* Watercolor decorations */}
      <img src="/assets/scattered-petals.png" alt="" aria-hidden="true"
        className="gallery-deco pointer-events-none absolute w-44 sm:w-60 md:w-80"
        style={{ top: '8%', right: '-4%', opacity: 0.03, transform: 'rotate(8deg)' }} />
      <img src="/assets/botanical-wreath.png" alt="" aria-hidden="true"
        className="gallery-deco pointer-events-none absolute w-36 sm:w-48 md:w-64"
        style={{ bottom: '6%', left: '-3%', opacity: 0.025, transform: 'rotate(-5deg)' }} />

      {/* Corner floral SVGs */}
      <div className="gallery-deco pointer-events-none absolute -top-3 -left-3 w-24 h-24 sm:w-32 sm:h-32 opacity-[0.06]">
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          <path d="M20 100 Q25 60 40 40 Q55 25 80 20" stroke="#D4A574" strokeWidth="0.8" fill="none" />
          {[0,40,80].map((a,i) => (
            <ellipse key={i} cx={75-i*18} cy={25+i*15} rx="7" ry="12" fill="#F2D5D0" opacity={0.5-i*0.1} transform={`rotate(${-30+a} ${75-i*18} ${25+i*15})`} />
          ))}
        </svg>
      </div>
      <div className="gallery-deco pointer-events-none absolute -bottom-3 -right-3 w-20 h-20 sm:w-28 sm:h-28 opacity-[0.05] rotate-180">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path d="M15 85 Q20 50 35 35 Q50 20 70 15" stroke="#E8C4C4" strokeWidth="0.7" fill="none" />
          <ellipse cx="65" cy="18" rx="6" ry="10" fill="#E8C4C4" opacity="0.4" transform="rotate(-20 65 18)" />
          <ellipse cx="42" cy="42" rx="6" ry="2" fill="#D4A574" opacity="0.25" transform="rotate(-35 42 42)" />
        </svg>
      </div>

      {/* Heading */}
      <div className="carousel-heading text-center mb-10 sm:mb-14 px-6">
        <h2 className="font-serif tracking-[-0.02em] mb-4"
          style={{ color: '#1A1614', fontWeight: 300, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
          Momen Kita
        </h2>
        <div className="mx-auto h-px w-12 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.4), transparent)' }} />
      </div>

      {/* Scroll container */}
      <div className="relative">
        {/* Nav arrows */}
        {[
          { dir: 'left' as const, show: canScrollLeft, cls: 'left-2 sm:left-4' },
          { dir: 'right' as const, show: canScrollRight, cls: 'right-2 sm:right-4' },
        ].map(({ dir, show, cls }) => (
          <div key={dir}
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 z-10 ${cls} transition-opacity duration-500`}
            style={{ opacity: show ? 1 : 0 }}>
            <button type="button" onClick={() => scrollTo(dir)}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{ background: 'rgba(255,248,240,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(212,165,116,0.1)', boxShadow: '0 2px 10px rgba(26,22,20,0.04)' }}
              aria-label={`Scroll ${dir}`}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d={dir === 'left' ? 'M9 2L4 7L9 12' : 'M5 2L10 7L5 12'} stroke="#1A1614" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
              </svg>
            </button>
          </div>
        ))}

        {/* Cards with real photos */}
        <div ref={scrollRef}
          className="carousel-scroll flex gap-4 sm:gap-5 overflow-x-auto px-6 sm:px-10 pb-4 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

          <div className="shrink-0 w-2 sm:w-8" />

          {CARDS.map((card, i) => (
            <TiltCard key={i} card={card} />
          ))}

          <div className="shrink-0 w-2 sm:w-8" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.carousel-scroll::-webkit-scrollbar{display:none}` }} />
    </section>
  );
}
