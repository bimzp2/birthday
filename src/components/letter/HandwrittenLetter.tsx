'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const LETTER_PARAGRAPHS = [
  `Hai Asa, selamat ulang tahun ya! Waktu nulis ini, aku senyum-senyum sendiri inget pertama kali kita ngobrol. Nggak nyangka aja dari obrolan random itu, sekarang kamu jadi salah satu orang paling penting buat aku.`,

  `Kamu tahu nggak sih, tiap kali aku lagi capek atau ngerasa dunia lagi berat banget, inget kamu tuh rasanya kayak dapet pelukan hangat. Kamu selalu punya cara buat bikin suasana jadi jauh lebih tenang. Ketulusan kamu, sabarnya kamu... aku bersyukur banget bisa ngerasain itu semua.`,

  `Di hari spesial kamu ini, aku cuma mau bilang makasih. Makasih ya udah bertahan, makasih udah terus jadi orang baik, dan makasih udah kasih aku kesempatan buat ada di hidup kamu. Harapanku buat kamu nggak banyak, aku cuma pengen kamu bahagia.`,

  `Semoga apa pun yang lagi kamu usahain sekarang dimudahin jalannya. Jangan lupa istirahat, jangan terlalu keras sama diri sendiri. You deserve all the good things in the world, Asa.`,
];

/* Dried flower decoration SVG */
function DriedFlower() {
  return (
    <svg className="absolute -top-2 -right-2 w-20 h-20 sm:w-24 sm:h-24 opacity-[0.10] pointer-events-none"
      viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="lt-pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8C4C4" />
          <stop offset="100%" stopColor="#F2D5D0" />
        </linearGradient>
        <linearGradient id="lt-lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="100%" stopColor="#EDCFC4" />
        </linearGradient>
      </defs>
      <path d="M55 95 Q50 70 52 50 Q54 35 48 15" stroke="#D4A574" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M52 50 Q65 42 72 46" stroke="#D4A574" strokeWidth="0.7" fill="none" />
      <path d="M50 68 Q38 60 32 64" stroke="#D4A574" strokeWidth="0.7" fill="none" />
      <ellipse cx="44" cy="14" rx="6" ry="11" fill="url(#lt-pg)" opacity="0.6" transform="rotate(-15 44 14)" />
      <ellipse cx="53" cy="11" rx="5" ry="9" fill="url(#lt-pg)" opacity="0.5" transform="rotate(10 53 11)" />
      <ellipse cx="48" cy="19" rx="4" ry="8" fill="url(#lt-pg)" opacity="0.4" transform="rotate(-5 48 19)" />
      <ellipse cx="68" cy="44" rx="8" ry="3" fill="url(#lt-lg)" opacity="0.4" transform="rotate(-20 68 44)" />
      <ellipse cx="36" cy="62" rx="6" ry="2.2" fill="url(#lt-lg)" opacity="0.3" transform="rotate(25 36 62)" />
      <circle cx="48" cy="14" r="2" fill="#D4A574" opacity="0.4" />
    </svg>
  );
}

function BottomFloral() {
  return (
    <svg className="absolute -bottom-1 -left-1 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.08] pointer-events-none rotate-180"
      viewBox="0 0 80 80" fill="none">
      <path d="M40 75 Q38 55 40 40 Q42 28 38 12" stroke="#EDCFC4" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <ellipse cx="35" cy="10" rx="4" ry="8" fill="#F2D5D0" opacity="0.5" transform="rotate(-10 35 10)" />
      <ellipse cx="42" cy="8" rx="3.5" ry="6" fill="#E8C4C4" opacity="0.4" transform="rotate(15 42 8)" />
      <ellipse cx="48" cy="38" rx="5" ry="1.8" fill="#D4A574" opacity="0.3" transform="rotate(-15 48 38)" />
    </svg>
  );
}

function SideBotanical({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left';
  return (
    <svg className={`letter-side-floral pointer-events-none absolute top-1/2 -translate-y-1/2 w-16 h-40 sm:w-24 sm:h-56 ${isLeft ? '-left-4 sm:-left-8' : '-right-4 sm:-right-8'}`}
      style={{ opacity: 0.05, transform: `translateY(-50%) ${isLeft ? '' : 'scaleX(-1)'}` }}
      viewBox="0 0 60 160" fill="none">
      <path d="M30 155 Q28 120 30 90 Q32 60 28 30 Q26 15 30 5" stroke="#D4A574" strokeWidth="0.7" strokeLinecap="round" fill="none" />
      <path d="M30 50 Q42 40 48 44" stroke="#D4A574" strokeWidth="0.5" fill="none" />
      <path d="M30 80 Q18 72 14 76" stroke="#D4A574" strokeWidth="0.5" fill="none" />
      <path d="M30 110 Q40 104 45 108" stroke="#D4A574" strokeWidth="0.5" fill="none" />
      {[0,72,144,216,288].map((a,i) => (
        <ellipse key={i} cx="28" cy="8" rx="3.5" ry="6" fill="#F2D5D0" opacity={0.45} transform={`rotate(${a} 28 14)`} />
      ))}
      <circle cx="28" cy="14" r="1.8" fill="#D4A574" opacity="0.25" />
      <ellipse cx="44" cy="42" rx="5" ry="1.8" fill="#D4A574" opacity="0.2" transform="rotate(-20 44 42)" />
      <ellipse cx="18" cy="74" rx="4" ry="1.5" fill="#D4A574" opacity="0.18" transform="rotate(22 18 74)" />
      <ellipse cx="42" cy="106" rx="4.5" ry="1.6" fill="#D4A574" opacity="0.18" transform="rotate(-18 42 106)" />
    </svg>
  );
}

export default function HandwrittenLetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: -0.3, y: 0 }); // base rotation

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!paperRef.current) return;
    const rect = paperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;
    setTilt({ x: yPct * 12, y: -xPct * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: -0.3, y: 0 }); // reset to base
  };

  useGSAP(() => {
    if (!paperRef.current) return;

    gsap.fromTo(paperRef.current,
      { opacity: 0, y: 50, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, ease: 'power2.out',
        scrollTrigger: { trigger: paperRef.current, start: 'top 82%', end: 'top 42%', scrub: 1.2 } }
    );

    paperRef.current.querySelectorAll('.letter-p').forEach((p, i) => {
      gsap.fromTo(p,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: p, start: 'top 88%', toggleActions: 'play none none reverse' },
          delay: i * 0.1 }
      );
    });

    const heading = paperRef.current.querySelector('.letter-heading');
    if (heading) {
      gsap.fromTo(heading, { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: heading, start: 'top 88%', toggleActions: 'play none none reverse' } });
    }

    const closing = paperRef.current.querySelector('.letter-closing');
    if (closing) {
      gsap.fromTo(closing, { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: closing, start: 'top 92%', toggleActions: 'play none none reverse' }, delay: 0.2 });
    }

    const sideFloral = sectionRef.current?.querySelectorAll('.letter-side-floral');
    if (sideFloral) {
      sideFloral.forEach((el) => {
        gsap.fromTo(el, { yPercent: 10 },
          { yPercent: -10, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current!, start: 'top bottom', end: 'bottom top', scrub: 2 } });
      });
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 md:py-40 px-5 sm:px-6"
      style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FAF0E6 50%, #FFF8F0 100%)' }}>

      {/* Paper texture */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 25% 40%, rgba(212,165,116,0.02) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(26,22,20,0.006) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 3px 3px',
        }} />

      {/* Watercolor image decorations */}
      <img src="/assets/cherry-blossom.png" alt="" aria-hidden="true"
        className="pointer-events-none absolute w-40 sm:w-56 md:w-72"
        style={{ top: '5%', right: '-3%', opacity: 0.03, transform: 'rotate(12deg)' }} />
      <img src="/assets/botanical-corner.png" alt="" aria-hidden="true"
        className="pointer-events-none absolute w-36 sm:w-48 md:w-60"
        style={{ bottom: '5%', left: '-2%', opacity: 0.025, transform: 'rotate(-5deg) scaleY(-1)' }} />

      <SideBotanical side="left" />
      <SideBotanical side="right" />

      {/* Section heading */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="font-serif tracking-[-0.02em] mb-4"
          style={{ color: '#1A1614', fontWeight: 300, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
          Surat Untukmu
        </h2>
        <div className="mx-auto h-px w-12 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.4), transparent)' }} />
      </div>

      <div style={{ perspective: '1200px' }} className="mx-auto max-w-2xl">
        <motion.div ref={paperRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full px-7 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16"
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: 'spring', stiffness: 100, damping: 30, mass: 1 }}
          style={{
            borderRadius: '3px 6px 4px 5px',
            backgroundColor: '#FFFCF7',
            backgroundImage: `
              radial-gradient(ellipse at 15% 45%, rgba(212,165,116,0.03) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 25%, rgba(232,196,196,0.035) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(0,0,0,0.006) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 3px 3px',
            boxShadow: '0 1px 2px rgba(26,22,20,0.03), 0 4px 16px rgba(26,22,20,0.035), 0 16px 48px rgba(26,22,20,0.04), inset 0 0 80px rgba(212,165,116,0.015)',
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity',
          }}>

          {/* Content that lifts up based on 3D */}
          <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>


        {/* Warm lighting */}
        <div className="pointer-events-none absolute inset-0"
          style={{ borderRadius: 'inherit', background: 'linear-gradient(135deg, rgba(212,165,116,0.04) 0%, transparent 50%)' }} />

        <DriedFlower />
        <BottomFloral />

        {/* Heading */}
        <div className="letter-heading mb-7 sm:mb-9" style={{ opacity: 0 }}>
          <h3 style={{
            fontFamily: "'Caveat', cursive", color: '#1A1614', fontWeight: 500,
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1.3, marginBottom: '0.25rem',
          }}>
            Untuk Asa tersayang,
          </h3>
          <div className="mt-4 h-px w-12"
            style={{ background: 'linear-gradient(90deg, rgba(212,165,116,0.4), transparent)', }} />
        </div>

        {/* Body */}
        <div className="space-y-5 sm:space-y-6">
          {LETTER_PARAGRAPHS.map((para, i) => (
            <p key={i} className="letter-p text-justify"
              style={{
                color: '#1A1614', fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400, opacity: 0, willChange: 'transform, opacity',
                fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', lineHeight: 1.9,
              }}>
              {para}
            </p>
          ))}
        </div>

        {/* Closing */}
        <div className="mt-9 sm:mt-11 letter-closing" style={{ opacity: 0 }}>
          <p className="italic mb-4"
            style={{ color: '#1A1614', fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300, fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}>
            Dengan seluruh cinta,
          </p>
          <div className="h-7 w-24 sm:w-28"
            style={{ borderBottom: '1px solid rgba(212,165,116,0.25)' }} />
        </div>

        {/* Aged edges */}
        <div className="pointer-events-none absolute inset-0"
          style={{ borderRadius: 'inherit', boxShadow: 'inset 0 0 40px rgba(26,22,20,0.012)' }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
