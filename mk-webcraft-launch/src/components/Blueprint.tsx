import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { EASE, progress } from '../lib/motion';
import { CUES } from '../timeline';
import { FONTS, neon } from '../theme';

const W = 1180;
const H = 608;
const COLS = 12;
const MARGIN = 40;
const GUTTER = 20;
const COL_W = (W - MARGIN * 2 - GUTTER * (COLS - 1)) / COLS;

type Frame = { kind: 'rect' | 'circle'; x: number; y: number; w: number; h: number; r?: number; label: string; doneAt: number };

// Wireframe boxes match the Viscont desktop layout so each one hands off to the real element.
const FRAMES: Frame[] = [
  { kind: 'rect', x: 14, y: 10, w: W - 28, h: 44, r: 8, label: 'nav', doneAt: CUES.nav },
  { kind: 'circle', x: 590, y: 206, w: 62, h: 62, label: 'hero / media', doneAt: CUES.diamond },
  { kind: 'rect', x: 236, y: 262, w: 708, h: 140, r: 10, label: 'h1 · display', doneAt: CUES.wordmark + 8 },
  { kind: 'rect', x: 326, y: 410, w: 528, h: 30, r: 6, label: 'tagline', doneAt: CUES.tagline },
  { kind: 'rect', x: 486, y: 452, w: 208, h: 48, r: 24, label: 'cta', doneAt: CUES.tagline + 6 },
  { kind: 'rect', x: 14, y: 558, w: W - 28, h: 40, r: 6, label: 'marquee', doneAt: CUES.marquee },
];

export const BlueprintBase: React.FC = () => <div style={{ position: 'absolute', width: W, height: H, background: '#070707' }} />;

export const BlueprintOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const gridOut = interpolate(frame, [CUES.panelsOut - 20, CUES.panelsOut + 10], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <g opacity={gridOut}>
        {Array.from({ length: COLS }).map((_, i) => {
          const p = progress(frame, CUES.grid + i * 1.2, 18, EASE.out);
          const x = MARGIN + i * (COL_W + GUTTER);
          return (
            <g key={i}>
              <rect x={x} y={0} width={COL_W} height={H * p} fill={neon(0.018)} />
              <line x1={x} y1={0} x2={x} y2={H * p} stroke={neon(0.11)} strokeWidth={1} />
              <line x1={x + COL_W} y1={0} x2={x + COL_W} y2={H * p} stroke={neon(0.11)} strokeWidth={1} />
            </g>
          );
        })}
        <text
          x={MARGIN}
          y={H - 14}
          fill={neon(0.6 * progress(frame, CUES.grid + 6, 12))}
          fontFamily={FONTS.mono}
          fontSize={13}
          letterSpacing="0.06em"
        >
          GRID · 12 COL · 1180 × 608
        </text>
      </g>

      {FRAMES.map((f, i) => {
        const draw = progress(frame, CUES.wireframe + i * 3, 16, EASE.inOut);
        const fade = 1 - progress(frame, f.doneAt, 10, EASE.out);
        if (draw <= 0 || fade <= 0) return null;
        const perim = f.kind === 'circle' ? 2 * Math.PI * f.w : 2 * (f.w + f.h);
        const common = {
          fill: 'none',
          stroke: neon(0.75),
          strokeWidth: 1.5,
          strokeDasharray: `${perim}`,
          strokeDashoffset: perim * (1 - draw),
          opacity: fade,
        };
        return (
          <g key={f.label}>
            {f.kind === 'circle' ? (
              <circle cx={f.x} cy={f.y} r={f.w} {...common} />
            ) : (
              <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={f.r} {...common} />
            )}
            <text
              x={f.kind === 'circle' ? f.x + f.w + 10 : f.x + 6}
              y={f.kind === 'circle' ? f.y + 4 : f.y - 6}
              fill={neon(0.7 * draw * fade)}
              fontFamily={FONTS.mono}
              fontSize={12}
              letterSpacing="0.05em"
            >
              {f.label.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
