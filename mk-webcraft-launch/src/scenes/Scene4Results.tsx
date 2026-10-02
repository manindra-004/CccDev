import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Phone, PHONE, PHONE_H, Tablet, TABLET, TABLET_H } from '../components/Devices';
import { windowPlacement } from '../components/HeroWindow';
import { StatBadge } from '../components/StatBadge';
import { mix, springAt, SPRINGS } from '../lib/motion';
import { CUES } from '../timeline';

const COLLAPSE_TO = { x: 960, y: 560 };

const deviceStyle = (frame: number, start: number, home: { x: number; y: number }, w: number, h: number, fromX: number): React.CSSProperties => {
  const p = springAt(frame, start, SPRINGS.glide);
  const { collapse } = windowPlacement(frame);
  const bob = Math.sin((frame - start) / 22) * 4;
  const x = mix(home.x + fromX * (1 - p), COLLAPSE_TO.x, collapse * 0.9);
  const y = mix(home.y + bob, COLLAPSE_TO.y, collapse * 0.9);
  const scale = (0.9 + 0.1 * p) * mix(1, 0.2, collapse);
  return {
    position: 'absolute',
    left: x - w / 2,
    top: y - h / 2,
    transform: `scale(${scale}) rotate(${(1 - p) * (fromX < 0 ? -7 : 7)}deg)`,
    opacity: Math.min(1, p * 1.6) * (1 - collapse),
    filter: collapse > 0.01 ? `blur(${collapse * 10}px)` : undefined,
  };
};

// Responsive variants of the same storefront flank the laptop.
export const Scene4Devices: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CUES.tablet || frame > CUES.collapse + 30) return null;
  return (
    <AbsoluteFill>
      <div style={deviceStyle(frame, CUES.tablet, { x: 432, y: 652 }, TABLET.w, TABLET_H, -520)}>
        <Tablet />
      </div>
      <div style={deviceStyle(frame, CUES.phone, { x: 1462, y: 650 }, PHONE.w, PHONE_H, 520)}>
        <Phone />
      </div>
    </AbsoluteFill>
  );
};

export const Scene4Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CUES.stat1 || frame > CUES.collapse + 30) return null;
  return (
    <AbsoluteFill>
      <StatBadge value={34} label="Conversion rate" source="Viscont Jewellery" start={CUES.stat1} exitAt={CUES.collapse - 6} x={96} y={262} />
      <StatBadge value={19} label="Customer retention" source="Viscont Jewellery" start={CUES.stat2} exitAt={CUES.collapse - 4} x={1824} y={262} anchor="right" />
    </AbsoluteFill>
  );
};
