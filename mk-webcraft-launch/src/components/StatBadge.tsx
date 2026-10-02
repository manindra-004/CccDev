import React from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, progress, springAt, SPRINGS } from '../lib/motion';
import { COLORS, FONTS, white } from '../theme';
import { glass } from './glass';

type Props = {
  value: number;
  label: string;
  source: string;
  start: number;
  exitAt: number;
  x: number;
  y: number;
  // Which edge of the card sits at x.
  anchor?: 'left' | 'right';
};

export const StatBadge: React.FC<Props> = ({ value, label, source, start, exitAt, x, y, anchor = 'left' }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const p = springAt(frame, start, SPRINGS.smooth);
  const count = Math.round(value * progress(frame, start + 2, 24, EASE.out));
  const exit = progress(frame, exitAt, 14, EASE.inOut);
  const fade = progress(frame, exitAt, 12, EASE.out);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateX(${anchor === 'right' ? '-100%' : '0'}) translateY(${(1 - p) * 30 - exit * 20}px) scale(${0.94 + 0.06 * p})`,
        transformOrigin: anchor === 'right' ? 'right center' : 'left center',
        opacity: Math.min(1, p * 1.5) * (1 - fade),
        ...glass(),
        borderRadius: 24,
        padding: '18px 28px 18px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        fontFamily: FONTS.display,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 600,
          letterSpacing: '-0.05em',
          color: COLORS.neon,
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 26px rgba(230,250,20,0.35)',
          minWidth: 140,
        }}
      >
        +{count}%
      </div>
      <div>
        <div style={{ fontSize: 23, fontWeight: 500, color: white(0.94), letterSpacing: '-0.01em' }}>{label}</div>
        <div style={{ marginTop: 4, fontSize: 15, color: white(0.5) }}>{source}</div>
      </div>
    </div>
  );
};
