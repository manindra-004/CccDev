import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { EASE, progress } from '../lib/motion';

// Real MK Webcraft case-study imagery from mkwebcraft.in/projects.
const CARDS = [
  { src: 'images/project-kwality.jpg', x: -150, y: 150, rot: 30 },
  { src: 'images/project-bysolar.jpg', x: -190, y: 560, rot: 30 },
  { src: 'images/project-nyxgard.jpg', x: 1650, y: 150, rot: -30 },
  { src: 'images/project-ezohr.jpg', x: 1690, y: 560, rot: -30 },
];

export const PortfolioWall: React.FC<{ start: number; exitAt: number }> = ({ start, exitAt }) => {
  const frame = useCurrentFrame();
  const enter = progress(frame, start, 30, EASE.out);
  const exit = progress(frame, exitAt, 20, EASE.in);
  if (enter <= 0 || exit >= 1) return null;
  const drift = (frame - start) * 0.25;

  return (
    <div style={{ position: 'absolute', inset: 0, perspective: 1400, perspectiveOrigin: '50% 50%' }}>
      {CARDS.map((c, i) => {
        const left = c.x < 960;
        return (
          <div
            key={c.src}
            style={{
              position: 'absolute',
              left: c.x + (left ? -1 : 1) * (1 - enter) * 160,
              top: c.y - drift * (i % 2 ? 1 : -1),
              width: 420,
              height: 280,
              borderRadius: 22,
              overflow: 'hidden',
              transform: `rotateY(${c.rot}deg)`,
              transformOrigin: left ? 'left center' : 'right center',
              opacity: 0.32 * enter * (1 - exit),
              filter: 'blur(2.4px) saturate(0.85)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Img src={staticFile(c.src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        );
      })}
    </div>
  );
};
