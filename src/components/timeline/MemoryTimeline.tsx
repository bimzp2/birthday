'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TimelineNode from './TimelineNode';

gsap.registerPlugin(ScrollTrigger);

/* ── Timeline data ── */
const TIMELINE_DATA = [
  { date: '2019', title: 'The Beginning', note: 'When the first chapter started' },
  { date: '2020', title: 'Growing Together', note: 'Through every storm, we found sunshine' },
  { date: '2021', title: 'New Adventures', note: 'Discovering the world through your eyes' },
  { date: '2022', title: 'Brighter Days', note: 'Every day brighter than the last' },
  { date: '2023', title: 'Deeper Roots', note: 'Building something that lasts forever' },
  { date: '2024', title: 'This Moment', note: 'Right here, right now — this is everything' },
];

export default function MemoryTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleNodeClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  /* ── Check scroll edges ── */
  const updateScrollIndicators = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollIndicators();
    el.addEventListener('scroll', updateScrollIndicators, { passive: true });
    window.addEventListener('resize', updateScrollIndicators);

    return () => {
      el.removeEventListener('scroll', updateScrollIndicators);
      window.removeEventListener('resize', updateScrollIndicators);
    };
  }, [updateScrollIndicators]);

  /* ── GSAP stagger reveal ── */
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const nodes = sectionRef.current.querySelectorAll('.timeline-node');
      gsap.set(nodes, { opacity: 0, y: 40 });

      gsap.to(nodes, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      /* ── Heading animation ── */
      const heading = sectionRef.current.querySelector('.timeline-heading');
      if (heading) {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  /* ── Scroll helpers ── */
  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 340;
    el.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FFF8F0 0%, #FAF0E6 40%, #F5E6D3 100%)',
      }}
    >
      {/* ── Heading ── */}
      <div className="timeline-heading text-center mb-16 px-6">
        <h2
          className="text-4xl md:text-6xl font-serif tracking-tight mb-3"
          style={{ color: '#1A1614' }}
        >
          Our Timeline
        </h2>
        <div
          className="mx-auto h-[2px] w-16 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, #D4A574 20%, #D4A574 80%, transparent)',
          }}
        />
      </div>

      {/* ── Scroll container ── */}
      <div className="relative">
        {/* Left arrow indicator */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 flex items-center pl-2 transition-opacity duration-300"
          style={{ opacity: canScrollLeft ? 1 : 0 }}
        >
          <button
            type="button"
            onClick={() => scrollTo('left')}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300"
            style={{
              background: 'rgba(255,248,240,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(212,165,116,0.2)',
            }}
            aria-label="Scroll left"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="opacity-50"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="#1A1614"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Right arrow indicator */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 flex items-center pr-2 transition-opacity duration-300"
          style={{ opacity: canScrollRight ? 1 : 0 }}
        >
          <button
            type="button"
            onClick={() => scrollTo('right')}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300"
            style={{
              background: 'rgba(255,248,240,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(212,165,116,0.2)',
            }}
            aria-label="Scroll right"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="opacity-50"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="#1A1614"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="memory-timeline-scroll flex items-end gap-2 overflow-x-auto px-8 pb-6 scroll-smooth"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Left spacer for centering first item */}
          <div className="shrink-0 w-8 md:w-16" />

          {TIMELINE_DATA.map((item, i) => (
            <TimelineNode
              key={item.date}
              date={item.date}
              title={item.title}
              note={item.note}
              index={i}
              isActive={i === activeIndex}
              onClick={() => handleNodeClick(i)}
            />
          ))}

          {/* Right spacer */}
          <div className="shrink-0 w-8 md:w-16" />
        </div>

        {/* ── Horizontal timeline line (behind nodes) ── */}
        <div
          className="pointer-events-none absolute left-0 right-0"
          style={{
            bottom: '2rem',
            height: 2,
            background:
              'linear-gradient(90deg, transparent 0%, #F2D5D0 10%, #E8C4C4 50%, #EDCFC4 90%, transparent 100%)',
          }}
        />
      </div>

      {/* Hide scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .memory-timeline-scroll::-webkit-scrollbar { display: none; }
      ` }} />
    </section>
  );
}
