import React from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, progress, springAt, SPRINGS } from '../lib/motion';
import { COLORS, FONTS, white } from '../theme';
import { glass } from './glass';

type Props = {
  label: string;
  anchor: { x: number; y: number };
  // Point where the leader line meets the tag; the tag grows away from the anchor.
  tag: { x: number; y: number };
  start: number;
  exitAt: number;
};

const ISSUE = (a: number) => `rgba(255, 106, 92, ${a})`;

export const ProblemTag: React.FC<Props> = ({ label, anchor, tag, start, exitAt }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;

  const ring = springAt(frame, start, SPRINGS.pop);
  const line = progress(frame, start + 2, 8, EASE.out);
  const pill = springAt(frame, start + 5, SPRINGS.smooth);
  const exit = progress(frame, exitAt, 14, EASE.inOut);
  const fade = progress(frame, exitAt, 12, EASE.out);
  const pulse = ((frame - start) % 30) / 30;
  const toLeft = tag.x < anchor.x;

  const dx = tag.x - anchor.x;
  const dy = tag.y - anchor.y;
  const len = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - fade, filter: exit > 0 ? `blur(${exit * 6}px)` : undefined }}>
      <div
        style={{
          position: 'absolute',
          left: anchor.x,
          top: anchor.y,
          width: len * line,
          height: 1.5,
          background: `linear-gradient(90deg, ${ISSUE(0.9)}, ${ISSUE(0.35)})`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: '0 50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: anchor.x - 8,
          top: anchor.y - 8,
          width: 16,
          height: 16,
          borderRadius: 8,
          border: `2px solid ${COLORS.issue}`,
          background: ISSUE(0.25),
          transform: `scale(${ring})`,
          boxShadow: `0 0 14px ${ISSUE(0.6)}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: anchor.x - 8,
          top: anchor.y - 8,
          width: 16,
          height: 16,
          borderRadius: 8,
          border: `1.5px solid ${ISSUE(0.6 * (1 - pulse))}`,
          transform: `scale(${1 + pulse * 1.8})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: tag.x,
          top: tag.y,
          transform: `translate(${toLeft ? '-100%' : '0'}, -50%) translateX(${(1 - pill) * (toLeft ? 24 : -24)}px) scale(${0.92 + 0.08 * pill})`,
          transformOrigin: toLeft ? 'right center' : 'left center',
          opacity: Math.min(1, pill * 1.4),
          ...glass(),
          borderRadius: 999,
          padding: '13px 24px 13px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          whiteSpace: 'nowrap',
          fontFamily: FONTS.display,
          fontSize: 25,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: white(0.94),
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 5, background: COLORS.issue, boxShadow: `0 0 10px ${ISSUE(0.9)}` }} />
        {label}
      </div>
    </div>
  );
};
