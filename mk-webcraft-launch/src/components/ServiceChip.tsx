import React from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, progress, springAt } from '../lib/motion';
import { COLORS, FONTS, neon, white } from '../theme';
import { glass } from './glass';

type Props = {
  label: string;
  icon: React.ReactNode;
  // Edge of the chip nearest the hero window: chips on the left are right-aligned to x.
  x: number;
  y: number;
  side: 'left' | 'right';
  start: number;
  exitAt: number;
};

export const ServiceChip: React.FC<Props> = ({ label, icon, x, y, side, start, exitAt }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const p = springAt(frame, start, { damping: 15, stiffness: 150, mass: 0.8 });
  const glow = 1 - progress(frame, start, 22, EASE.out);
  const exit = progress(frame, exitAt, 16, EASE.inOut);
  const fade = progress(frame, exitAt, 13, EASE.out);
  const dir = side === 'left' ? -1 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${side === 'left' ? '-100%' : '0'}, -50%) translateX(${(1 - p) * -dir * 46 + exit * dir * 110}px) scale(${0.86 + 0.14 * p})`,
        transformOrigin: side === 'left' ? 'right center' : 'left center',
        opacity: Math.min(1, p * 1.6) * (1 - fade),
        filter: exit > 0.01 ? `blur(${exit * 8}px)` : undefined,
        ...glass(),
        borderColor: `rgba(230,250,20,${0.12 + glow * 0.5})`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 ${30 * glow + 6}px ${neon(0.08 + glow * 0.3)}, inset 0 1px 0 rgba(255,255,255,0.09)`,
        borderRadius: 999,
        height: 70,
        padding: '0 30px 0 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        whiteSpace: 'nowrap',
        fontFamily: FONTS.display,
        fontSize: 27,
        fontWeight: 500,
        letterSpacing: '-0.015em',
        color: white(0.95),
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          background: neon(0.12),
          border: `1px solid ${neon(0.35)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: COLORS.neon,
        }}
      >
        {icon}
      </div>
      {label}
    </div>
  );
};
