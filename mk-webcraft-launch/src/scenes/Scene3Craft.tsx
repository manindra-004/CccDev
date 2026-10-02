import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { BrandPanel, CodePanel } from '../components/BuildPanels';
import { BoltIcon, CodeIcon, DevicesIcon, LayoutIcon, PenIcon, RankIcon, SparkIcon, SupportIcon } from '../components/Icons';
import { ProcessStepper } from '../components/ProcessStepper';
import { ServiceChip } from '../components/ServiceChip';
import { CUES } from '../timeline';

const ICON = { size: 21, strokeWidth: 2 };

// Left/right alternate so the ascending notes pan across the stereo field with the chips.
const SERVICES = [
  { label: 'Custom Design', icon: <PenIcon {...ICON} /> },
  { label: 'Development', icon: <CodeIcon {...ICON} /> },
  { label: 'Brand Identity', icon: <SparkIcon {...ICON} /> },
  { label: 'UI/UX', icon: <LayoutIcon {...ICON} /> },
  { label: 'Responsive', icon: <DevicesIcon {...ICON} /> },
  { label: 'Performance', icon: <BoltIcon {...ICON} /> },
  { label: 'SEO-Ready', icon: <RankIcon {...ICON} /> },
  { label: 'Ongoing Support', icon: <SupportIcon {...ICON} /> },
];

const ROWS = [470, 562, 654, 746];

export const Scene3Craft: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CUES.title3 - 30 || frame > CUES.toDevices + 30) return null;

  return (
    <AbsoluteFill>
      <BrandPanel x={96} y={418} />
      <CodePanel x={1424} y={452} />

      {SERVICES.map((s, i) => {
        const side = i % 2 === 0 ? 'left' : 'right';
        return (
          <ServiceChip
            key={s.label}
            label={s.label}
            icon={s.icon}
            side={side}
            x={side === 'left' ? 400 : 1520}
            y={ROWS[Math.floor(i / 2)]}
            start={CUES.chips[i]}
            exitAt={CUES.toDevices + (i % 4) * 2}
          />
        );
      })}

      <ProcessStepper y={944} activations={[320, CUES.brandPanel, CUES.codePanel, CUES.secure]} start={CUES.title3 + 6} exitAt={CUES.toDevices} />
    </AbsoluteFill>
  );
};
