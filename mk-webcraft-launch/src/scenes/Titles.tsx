import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticTitle } from '../components/KineticTitle';
import { CUES } from '../timeline';

type Title = { text: string; start: number; exitAt: number; top: number; size: number; stagger: number; exitDuration?: number };

// One short title per scene. Accent words (*word*) take the brand neon.
const TITLES: Title[] = [
  { text: 'First impressions happen *online.*', start: CUES.title1, exitAt: CUES.title1Out, top: 420, size: 104, stagger: 6, exitDuration: 10 },
  { text: 'Most websites fall short.', start: CUES.title2, exitAt: CUES.title2Out, top: 112, size: 96, stagger: 6 },
  { text: 'Crafted to *convert.*', start: CUES.title3, exitAt: CUES.title3Out, top: 118, size: 96, stagger: 8 },
  { text: 'From ordinary to *extraordinary.*', start: CUES.title4, exitAt: CUES.title4Out, top: 108, size: 96, stagger: 6 },
];

export const Titles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {TITLES.map((t) =>
        frame >= t.start - 2 && frame <= t.exitAt + 30 ? (
          <div key={t.text} style={{ position: 'absolute', left: 0, right: 0, top: t.top }}>
            <KineticTitle text={t.text} start={t.start} stagger={t.stagger} exitAt={t.exitAt} exitDuration={t.exitDuration} size={t.size} />
          </div>
        ) : null,
      )}
    </AbsoluteFill>
  );
};
