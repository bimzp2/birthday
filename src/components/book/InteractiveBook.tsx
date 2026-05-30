'use client';

import { useState, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DARK = '#0A0908';
const GOLD = '#D4A574';
const CREAM = '#FFF8F0';
const INK = '#1A1614';

export default function InteractiveBook() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === 'submitting') return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #0A0908 0%, #1A1510 50%, #0A0908 100%)' }}>
      
      {/* Background illumination */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${GOLD}15 0%, transparent 60%)`,
        }} />

      <div className="text-center absolute top-10 w-full" style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 1s' }}>
         <p className="font-serif italic text-lg" style={{ color: `${GOLD}80` }}>Sentuh bukunya untuk membuka</p>
      </div>

      {/* Book Container */}
      <div className="relative w-full flex items-center justify-center"
        style={{ perspective: '2000px', height: 'min(90vh, 700px)' }}>
        
        {/* The Book (Centers itself based on state) */}
        <motion.div className="relative"
          animate={{ x: isOpen ? '50%' : '0%' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            width: 'min(85vw, 55vh, 400px)', 
            height: 'min(113vw, 73vh, 533px)',
            transformStyle: 'preserve-3d' 
          }}>
          
          {/* Back Cover (Right side) */}
          <div className="absolute inset-0 origin-left"
            style={{ 
              background: '#2A1F1A', 
              borderRadius: '2px 10px 10px 2px',
              boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.5), 10px 20px 40px rgba(0,0,0,0.5)',
              transform: 'translateZ(-5px)'
            }} />

          {/* Right Page (The form) */}
          <div className="absolute inset-0 origin-left p-6 sm:p-10 flex flex-col"
            style={{
              zIndex: isOpen ? 50 : 1,
              pointerEvents: isOpen ? 'auto' : 'none',
              background: '#FFF8F0',
              borderLeft: '1px solid #E8C4C4',
              borderRadius: '2px 12px 12px 2px',
              backfaceVisibility: 'hidden',
              boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.05)',
            }}>
            
            <h3 className="font-serif text-2xl sm:text-3xl mb-4" style={{ color: INK }}>Tinggalkan Jejak</h3>
            <div className="w-12 h-px mb-6" style={{ background: GOLD }} />
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col relative z-10">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis sesuatu untukku..."
                className="flex-1 w-full bg-transparent resize-none outline-none font-serif text-lg leading-relaxed"
                style={{ 
                  color: INK, 
                  background: 'repeating-linear-gradient(transparent, transparent 31px, rgba(212,165,116,0.2) 31px, rgba(212,165,116,0.2) 32px)',
                  lineHeight: '32px',
                  paddingTop: '2px'
                }}
                disabled={status === 'success' || status === 'submitting'}
              />
              
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="font-serif text-center italic mt-4" style={{ color: GOLD }}>
                    Pesanmu telah disimpan oleh semesta.
                  </motion.p>
                ) : (
                  <motion.button 
                    initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                    type="submit" 
                    disabled={status === 'submitting' || !message.trim()}
                    className="mt-4 px-6 py-2 rounded border transition-colors self-end font-serif"
                    style={{ 
                      borderColor: GOLD, 
                      color: message.trim() ? DARK : GOLD,
                      background: message.trim() ? GOLD : 'transparent',
                      opacity: status === 'submitting' ? 0.5 : 1
                    }}>
                    {status === 'submitting' ? 'Menyimpan...' : 'Tuliskan'}
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Front Cover (Flips left) */}
          <motion.div 
            onClick={() => !isOpen && setIsOpen(true)}
            className="absolute inset-0 origin-left"
            animate={{ rotateY: isOpen ? -180 : 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              transformStyle: 'preserve-3d', 
              zIndex: isOpen ? 0 : 10,
              cursor: isOpen ? 'default' : 'pointer',
              pointerEvents: isOpen ? 'none' : 'auto'
            }}>
            
            {/* Outside Front Cover */}
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #3A2B24 0%, #1A120E 100%)',
                borderRadius: '2px 10px 10px 2px',
                backfaceVisibility: 'hidden',
                boxShadow: 'inset 4px 0 10px rgba(255,255,255,0.1), 5px 5px 20px rgba(0,0,0,0.5)',
                borderLeft: '4px solid #1A120E'
              }}>
              <div className="absolute inset-4 border flex items-center justify-center"
                style={{ borderColor: `${GOLD}40`, borderRadius: '2px 6px 6px 2px' }}>
                <h2 className="font-serif text-4xl sm:text-5xl tracking-widest uppercase"
                  style={{ 
                    color: GOLD, 
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    transform: 'translateZ(1px)' // Small 3D pop on text
                  }}>
                  Untuk Asa
                </h2>
              </div>
            </div>

            {/* Inside Front Cover (Left Page when open) */}
            <div className="absolute inset-0 flex flex-col p-6 sm:p-10"
              style={{ 
                background: CREAM, 
                borderRadius: '10px 2px 2px 10px',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(1px)',
                boxShadow: 'inset -5px 0 20px rgba(0,0,0,0.1)'
              }}>
              <div className="flex-1 flex flex-col justify-center items-center text-center opacity-80">
                <img src="/assets/photo-1.png" alt="Memori" className="w-3/4 max-w-[200px] mb-6 rounded shadow-md grayscale contrast-125" style={{ filter: 'sepia(0.3) hue-rotate(-15deg)' }} />
                <p className="font-serif italic text-lg leading-relaxed" style={{ color: INK }}>
                  "Setiap cerita yang kita tulis,<br />
                  akan abadi di sini."
                </p>
                {isOpen && (
                  <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    className="absolute top-4 left-4 text-xs tracking-widest font-sans uppercase opacity-50 hover:opacity-100 transition-opacity"
                    style={{ color: INK, pointerEvents: 'auto' }}>
                    Tutup Buku
                  </button>
                )}
              </div>
            </div>
            
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
