import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CHROME_H, windowPlacement, WINDOW_H, WINDOW_W } from '../components/HeroWindow';
import { OUTDATED_ANCHORS } from '../components/OutdatedSite';
import { ProblemTag } from '../components/ProblemTag';
import { CUES } from '../timeline';

type Issue = { label: string; anchor: keyof typeof OUTDATED_ANCHORS; tag: { x: number; y: number } };

// Callouts alternate sides of the window, each landing on a beat.
const ISSUES: Issue[] = [
  { label: 'Outdated design', anchor: 'heading', tag: { x: 1290, y: 378 } },
  { label: 'Weak branding', anchor: 'logo', tag: { x: 470, y: 470 } },
  { label: 'Poor user experience', anchor: 'nav', tag: { x: 1330, y: 560 } },
  { label: 'Slow to load', anchor: 'loadBar', tag: { x: 520, y: 262 } },
  { label: "Visitors don't convert", anchor: 'button', tag: { x: 470, y: 790 } },
];

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CUES.issues[0] || frame > CUES.beam + 30) return null;

  const { cx, cy } = windowPlacement(frame);
  const origin = { x: cx - WINDOW_W / 2, y: cy - WINDOW_H / 2 + CHROME_H };

  return (
    <AbsoluteFill>
      {ISSUES.map((issue, i) => {
        const a = OUTDATED_ANCHORS[issue.anchor];
        return (
          <ProblemTag
            key={issue.label}
            label={issue.label}
            anchor={{ x: origin.x + a.x, y: origin.y + a.y }}
            tag={issue.tag}
            start={CUES.issues[i]}
            exitAt={CUES.beam + 4 + i * 2}
          />
        );
      })}
    </AbsoluteFill>
  );
};
