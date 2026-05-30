'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   Story blocks — text + paired real photos
   ═══════════════════════════════════════════════════════ */
const STORY_BLOCKS = [
  {
    quote: 'Makasih ya udah selalu jadi tempat paling nyaman buat aku pulang.',
    sub: 'tempat ternyaman',
    photo: '/assets/photo-1.png',
    layout: 'text-left' as const,
  },
  {
    quote: 'Dari sekian banyak orang, aku selalu bersyukur karena ketemunya sama kamu.',
    sub: 'the luckiest to have you',
    photo: '/assets/photo-2.png',
    layout: 'text-right' as const,
  },
  {
    quote: 'Tiap hari bareng kamu rasanya duniaku jadi jauh lebih berwarna.',
    sub: 'my favorite color',
    photo: '/assets/photo-3.png',
    layout: 'text-left' as const,
  },
  {
    quote: 'Semoga kamu tahu kalau kehadiranku di sini, itu selalu buat kamu.',
    sub: 'always for you',
    photo: '/assets/photo-4.png',
    layout: 'text-right' as const,
  },
  {
    quote: 'Selamat bertambah umur, Asa. Aku akan selalu ada buat ngerayain setiap momen indahmu.',
    sub: 'a celebration of you',
    photo: '/assets/photo-5.png',
    layout: 'text-left' as const,
  },
];

/* ═══════════════════════════════════════════════════════
   SVG Decorations — unique per instance
   ═══════════════════════════════════════════════════════ */
function Sakura({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <defs>
        <radialGradient id={`${id}-g`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#F9E4E0" />
          <stop offset="100%" stopColor="#E8C4C4" />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((a, i) => (
        <ellipse key={i} cx="40" cy="18" rx="9" ry="15" fill={`url(#${id}-g)`}
          opacity={0.65 + i * 0.04} transform={`rotate(${a} 40 40)`} />
      ))}
      <circle cx="40" cy="40" r="4.5" fill="#D4A574" opacity="0.45" />
      <circle cx="40" cy="40" r="2" fill="#C49460" opacity="0.5" />
    </svg>
  );
}

function BotanicalLeaf({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 50 80" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id={`${id}-g`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#C9A06C" />
          <stop offset="100%" stopColor="#EDCFC4" />
        </linearGradient>
      </defs>
      <path d="M25 4 C40 18 42 40 35 58 C30 68 25 72 25 76 C25 72 20 68 15 58 C8 40 10 18 25 4Z"
        fill={`url(#${id}-g)`} opacity="0.5" />
      <path d="M25 12 Q25 40 25 68" stroke="#C49460" strokeWidth="0.5" opacity="0.25" fill="none" />
      <path d="M25 28 Q31 25 35 27" stroke="#C49460" strokeWidth="0.3" opacity="0.2" fill="none" />
      <path d="M25 42 Q19 39 15 41" stroke="#C49460" strokeWidth="0.3" opacity="0.2" fill="none" />
    </svg>
  );
}

function TinyBud({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 30 44" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id={`${id}-g`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#F2D5D0" />
          <stop offset="100%" stopColor="#D4A574" />
        </linearGradient>
      </defs>
      <path d="M15 42 Q15 30 15 20" stroke="#C49460" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.4" />
      <ellipse cx="12" cy="15" rx="4" ry="9" fill={`url(#${id}-g)`} opacity="0.55" transform="rotate(-10 12 15)" />
      <ellipse cx="18" cy="15" rx="4" ry="9" fill={`url(#${id}-g)`} opacity="0.45" transform="rotate(10 18 15)" />
      <ellipse cx="15" cy="13" rx="3" ry="7" fill={`url(#${id}-g)`} opacity="0.6" />
    </svg>
  );
}

function Butterfly({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 50 40" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2D5D0" />
          <stop offset="100%" stopColor="#E8C4C4" />
        </linearGradient>
      </defs>
      <path d="M25 20 C20 10 8 4 4 12 C0 20 10 26 25 20Z" fill={`url(#${id}-g)`} opacity="0.45" />
      <path d="M25 20 C30 10 42 4 46 12 C50 20 40 26 25 20Z" fill={`url(#${id}-g)`} opacity="0.4" />
      <path d="M25 20 C22 26 16 32 14 28 C12 24 18 22 25 20Z" fill={`url(#${id}-g)`} opacity="0.35" />
      <path d="M25 20 C28 26 34 32 36 28 C38 24 32 22 25 20Z" fill={`url(#${id}-g)`} opacity="0.3" />
      <line x1="25" y1="14" x2="25" y2="32" stroke="#C49460" strokeWidth="0.4" opacity="0.25" />
    </svg>
  );
}

function SmallHeart() {
  return (
    <svg viewBox="0 0 22 22" fill="none" className="w-full h-full">
      <path d="M11 19 C6 14 2 10 2 7 C2 4 4.5 2 7 2 C9 2 10.5 3.5 11 5 C11.5 3.5 13 2 15 2 C17.5 2 20 4 20 7 C20 10 16 14 11 19Z"
        fill="#E8C4C4" opacity="0.35" />
    </svg>
  );
}

function WildRose({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 70 70" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2D5D0" />
          <stop offset="100%" stopColor="#EDCFC4" />
        </linearGradient>
      </defs>
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <ellipse key={i} cx="35" cy="14" rx="7" ry="13" fill={`url(#${id}-g)`}
          opacity={0.5 + i * 0.04} transform={`rotate(${a} 35 35)`} />
      ))}
      <circle cx="35" cy="35" r="3.5" fill="#D4A574" opacity="0.4" />
    </svg>
  );
}

/* Star SVG */
function TinyStar() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
      <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8Z"
        fill="#D4A574" opacity="0.25" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Decoration layout — 3 parallax layers
   ═══════════════════════════════════════════════════════ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Deco { Component: React.FC<any>; top: string; left?: string; right?: string; size: number; rot: number; op: number; layer: 1|2|3; id?: string; }

const DECOS: Deco[] = [
  { Component: Sakura, top:'2%', left:'1%', size:65, rot:12, op:0.08, layer:1, id:'sk1' },
  { Component: BotanicalLeaf, top:'18%', right:'2%', size:50, rot:-20, op:0.07, layer:1, id:'bl1' },
  { Component: WildRose, top:'35%', left:'0%', size:55, rot:30, op:0.07, layer:1, id:'wr1' },
  { Component: Sakura, top:'52%', right:'1%', size:60, rot:-40, op:0.08, layer:1, id:'sk2' },
  { Component: WildRose, top:'68%', left:'1.5%', size:50, rot:15, op:0.06, layer:1, id:'wr3' },
  { Component: BotanicalLeaf, top:'85%', right:'2%', size:48, rot:-10, op:0.06, layer:1, id:'bl2' },

  { Component: TinyBud, top:'6%', right:'7%', size:32, rot:12, op:0.12, layer:2, id:'tb1' },
  { Component: Butterfly, top:'22%', left:'4%', size:34, rot:-5, op:0.10, layer:2, id:'bf1' },
  { Component: TinyBud, top:'40%', right:'5%', size:28, rot:20, op:0.11, layer:2, id:'tb2' },
  { Component: WildRose, top:'58%', left:'5%', size:42, rot:-10, op:0.09, layer:2, id:'wr2' },
  { Component: Butterfly, top:'75%', right:'8%', size:30, rot:15, op:0.08, layer:2, id:'bf2' },
  { Component: TinyBud, top:'92%', left:'6%', size:26, rot:-8, op:0.10, layer:2, id:'tb3' },

  { Component: SmallHeart, top:'3%', left:'15%', size:16, rot:-12, op:0.14, layer:3 },
  { Component: SmallHeart, top:'15%', right:'14%', size:14, rot:8, op:0.12, layer:3 },
  { Component: TinyStar, top:'25%', left:'20%', size:12, rot:20, op:0.10, layer:3 },
  { Component: SmallHeart, top:'33%', right:'10%', size:15, rot:-5, op:0.13, layer:3 },
  { Component: TinyStar, top:'42%', right:'18%', size:11, rot:45, op:0.09, layer:3 },
  { Component: SmallHeart, top:'50%', left:'12%', size:13, rot:18, op:0.11, layer:3 },
  { Component: SmallHeart, top:'60%', left:'18%', size:15, rot:-8, op:0.10, layer:3 },
  { Component: TinyStar, top:'70%', right:'20%', size:12, rot:30, op:0.08, layer:3 },
  { Component: SmallHeart, top:'78%', right:'16%', size:14, rot:22, op:0.12, layer:3 },
  { Component: SmallHeart, top:'88%', left:'10%', size:13, rot:-15, op:0.11, layer:3 },
  { Component: TinyStar, top:'95%', left:'22%', size:10, rot:60, op:0.09, layer:3 },
];

const LAYER_SPEED = { 1: 0.05, 2: 0.12, 3: 0.22 };

/* ═══════════════════════════════════════════════════════
   StorySection
   ═══════════════════════════════════════════════════════ */
export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const s = sectionRef.current;

    /* Text blocks — slow cinematic reveal */
    s.querySelectorAll('.story-text').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: 1.5 } }
      );
    });

    /* Image parallax — images move slower for cinematic depth */
    s.querySelectorAll('.story-image').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 100, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 30%', scrub: 2 } }
      );
    });

    /* Subtitle fade */
    s.querySelectorAll('.story-sub').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 55%', scrub: 1 } }
      );
    });

    /* Decoration parallax per layer */
    [1,2,3].forEach((layer) => {
      const speed = LAYER_SPEED[layer as 1|2|3];
      s.querySelectorAll(`.deco-l${layer}`).forEach((el) => {
        gsap.fromTo(el,
          { yPercent: speed * 100 },
          { yPercent: -speed * 100, ease: 'none',
            scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: 2 } }
        );
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative overflow-hidden"
      style={{ backgroundColor: '#FFF8F0' }}>

      {/* Paper texture overlay */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(212,165,116,0.025) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(232,196,196,0.02) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(26,22,20,0.008) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 3px 3px',
        }} />

      {/* Decorations */}
      {DECOS.map((d, i) => {
        const { Component, top, left, right, size, rot, op, layer, id } = d;
        return (
          <div key={i} className={`pointer-events-none absolute deco-l${layer}`}
            style={{ top, ...(left?{left}:{}), ...(right?{right}:{}), width:size, height:size,
              transform:`rotate(${rot}deg)`, opacity:op, willChange:'transform' }}>
            <Component id={id} />
          </div>
        );
      })}

      {/* Watercolor image decorations — large, very faded */}
      <img src="/assets/cherry-blossom.png" alt="" aria-hidden="true"
        className="pointer-events-none absolute deco-l1 w-52 sm:w-72 md:w-96"
        style={{ top: '8%', right: '-5%', opacity: 0.04, transform: 'rotate(15deg)', willChange: 'transform' }} />
      <img src="/assets/scattered-petals.png" alt="" aria-hidden="true"
        className="pointer-events-none absolute deco-l2 w-48 sm:w-64 md:w-80"
        style={{ top: '42%', left: '-4%', opacity: 0.035, transform: 'rotate(-8deg)', willChange: 'transform' }} />
      <img src="/assets/botanical-corner.png" alt="" aria-hidden="true"
        className="pointer-events-none absolute deco-l1 w-44 sm:w-60 md:w-72"
        style={{ top: '72%', right: '-3%', opacity: 0.04, transform: 'rotate(10deg) scaleX(-1)', willChange: 'transform' }} />
      <img src="/assets/botanical-wreath.png" alt="" aria-hidden="true"
        className="pointer-events-none absolute deco-l3 w-32 sm:w-44 md:w-56"
        style={{ top: '55%', left: '50%', transform: 'translateX(-50%)', opacity: 0.025, willChange: 'transform' }} />

      {/* Story blocks — alternating text + REAL photos */}
      {STORY_BLOCKS.map((block, idx) => {
        const isLeft = block.layout === 'text-left';
        return (
          <div key={idx} className="relative py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 lg:px-20"
            style={{ minHeight: '95vh', display: 'flex', alignItems: 'center' }}>
            <div className={`w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-center`}
              style={{ direction: isLeft ? 'ltr' : 'rtl' }}>

              {/* Text side */}
              <div className="story-text" style={{ direction: 'ltr', willChange: 'transform, opacity' }}>
                <p className="font-serif"
                  style={{
                    color: '#1A1614',
                    fontWeight: 300,
                    fontSize: 'clamp(1.4rem, 3.2vw, 2.6rem)',
                    lineHeight: 1.5,
                    letterSpacing: '-0.01em',
                    textWrap: 'pretty',
                  }}>
                  {block.quote}
                </p>
                <div className="story-sub mt-6 sm:mt-8 flex items-center gap-3"
                  style={{ willChange: 'transform, opacity' }}>
                  <span className="h-px flex-grow max-w-[40px]"
                    style={{ background: 'linear-gradient(90deg, rgba(212,165,116,0.4), transparent)' }} />
                  <span className="font-serif italic"
                    style={{ color: 'rgba(212,165,116,0.6)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', letterSpacing: '0.05em' }}>
                    {block.sub}
                  </span>
                </div>
              </div>

              {/* Image side — REAL photos with premium frame */}
              <div className="story-image" style={{ direction: 'ltr', willChange: 'transform, opacity' }}>
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl group"
                  style={{
                    aspectRatio: '4/5',
                    boxShadow: '0 8px 40px rgba(26,22,20,0.08), 0 2px 8px rgba(26,22,20,0.04)',
                  }}>
                  {/* Actual photo */}
                  <img src={block.photo} alt={block.sub}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
                    style={{ filter: 'saturate(0.85) contrast(0.95) brightness(1.02)' }}
                    loading="lazy" />

                  {/* Warm cinematic overlay */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 40%, rgba(26,22,20,0.25) 100%)' }} />

                  {/* Soft vignette on image */}
                  <div className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(26,22,20,0.12) 100%)' }} />

                  {/* Small corner floral on image */}
                  <div className="absolute top-3 right-3 w-10 h-10 sm:w-14 sm:h-14 opacity-[0.15] pointer-events-none">
                    <svg viewBox="0 0 50 50" fill="none" className="w-full h-full">
                      {[0,72,144,216,288].map((a,i) => (
                        <ellipse key={i} cx="25" cy="10" rx="5" ry="9" fill="#FFF8F0"
                          opacity={0.5} transform={`rotate(${a} 25 25)`} />
                      ))}
                      <circle cx="25" cy="25" r="2.5" fill="#FFF8F0" opacity="0.4" />
                    </svg>
                  </div>

                  {/* Hover warm glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 80px rgba(212,165,116,0.08)' }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
