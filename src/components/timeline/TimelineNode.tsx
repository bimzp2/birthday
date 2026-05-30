'use client';

import { useRef } from 'react';

interface TimelineNodeProps {
  date: string;
  title: string;
  note: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export default function TimelineNode({
  date,
  title,
  note,
  index,
  isActive,
  onClick,
}: TimelineNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={nodeRef}
      className="timeline-node snap-center shrink-0 flex flex-col items-center px-4"
      style={{ minWidth: 300 }}
    >
      {/* ── Glass card ── */}
      <button
        type="button"
        onClick={onClick}
        className="group relative w-full cursor-pointer rounded-2xl p-6 text-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          background: isActive
            ? 'rgba(212, 165, 116, 0.12)'
            : 'rgba(255, 248, 240, 0.45)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
          border: isActive
            ? '1px solid rgba(212, 165, 116, 0.35)'
            : '1px solid rgba(212, 165, 116, 0.12)',
          boxShadow: isActive
            ? '0 8px 32px rgba(212,165,116,0.15), 0 2px 8px rgba(26,22,20,0.06)'
            : '0 4px 20px rgba(26,22,20,0.04), 0 1px 4px rgba(26,22,20,0.03)',
          transform: isActive ? 'scale(1.05)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 8px 32px rgba(212,165,116,0.12), 0 2px 8px rgba(26,22,20,0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 4px 20px rgba(26,22,20,0.04), 0 1px 4px rgba(26,22,20,0.03)';
          }
        }}
      >
        {/* Title */}
        <h3
          className="text-xl font-serif mb-1"
          style={{ color: '#1A1614' }}
        >
          {title}
        </h3>

        {/* Note */}
        <p
          className="text-sm leading-relaxed opacity-70"
          style={{ color: '#1A1614', fontFamily: 'Inter, sans-serif' }}
        >
          {note}
        </p>

        {/* Gold accent line */}
        <div
          className="mt-4 h-px w-10 rounded-full transition-all duration-500"
          style={{
            background: 'linear-gradient(90deg, #D4A574, transparent)',
            width: isActive ? 48 : 40,
          }}
        />
      </button>

      {/* ── Connector stem to timeline line ── */}
      <div
        className="w-px h-6"
        style={{
          background: `linear-gradient(to bottom, ${
            isActive ? 'rgba(212,165,116,0.6)' : 'rgba(212,165,116,0.25)'
          }, transparent)`,
        }}
      />

      {/* ── Circular date marker ── */}
      <div className="relative flex flex-col items-center">
        <div
          className="flex items-center justify-center rounded-full transition-all duration-500"
          style={{
            width: isActive ? 52 : 44,
            height: isActive ? 52 : 44,
            background: isActive
              ? 'linear-gradient(135deg, #D4A574 0%, #E8C4C4 100%)'
              : 'linear-gradient(135deg, rgba(212,165,116,0.3) 0%, rgba(232,196,196,0.3) 100%)',
            border: isActive
              ? '2px solid rgba(212,165,116,0.5)'
              : '2px solid rgba(212,165,116,0.15)',
            boxShadow: isActive
              ? '0 0 20px rgba(212,165,116,0.3)'
              : '0 0 8px rgba(212,165,116,0.08)',
          }}
        >
          <span
            className="text-xs font-semibold tracking-wider"
            style={{
              color: isActive ? '#FFF8F0' : '#1A1614',
              fontFamily: 'Inter, sans-serif',
              opacity: isActive ? 1 : 0.6,
            }}
          >
            {date}
          </span>
        </div>
      </div>
    </div>
  );
}
