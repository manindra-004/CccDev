import React from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, progress, springAt } from '../lib/motion';
import { COLORS, FONTS } from '../theme';

type Props = {
  // Words separated by spaces. Wrap a word in asterisks (*word*) to give it the neon accent.
  text: string;
  start: number;
  stagger?: number;
  exitAt?: number;
  exitStagger?: number;
  exitDuration?: number;
  size?: number;
  weight?: number;
  color?: string;
  accentColor?: string;
  tracking?: string;
  lineHeight?: number;
  font?: string;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
  // Explicit line breaks: index of the word that starts each new line.
  breaks?: number[];
};

const WORD_SPRING = { damping: 16, stiffness: 120, mass: 0.9 };

export const KineticTitle: React.FC<Props> = ({
  text,
  start,
  stagger = 6,
  exitAt,
  exitStagger = 2,
  exitDuration = 14,
  size = 96,
  weight = 600,
  color = COLORS.white,
  accentColor = COLORS.neon,
  tracking = '-0.045em',
  lineHeight = 1.06,
  font = FONTS.display,
  style,
  wordStyle,
  breaks = [],
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ').map((raw) => {
    const accent = raw.startsWith('*') && raw.endsWith('*');
    return { text: accent ? raw.slice(1, -1) : raw, accent };
  });

  const lines: { text: string; accent: boolean; index: number }[][] = [[]];
  words.forEach((w, index) => {
    if (breaks.includes(index) && lines[lines.length - 1].length > 0) lines.push([]);
    lines[lines.length - 1].push({ ...w, index });
  });

  return (
    <div
      style={{
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: tracking,
        lineHeight,
        color,
        textAlign: 'center',
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: 'nowrap' }}>
          {line.map((w, wi) => {
            const s = springAt(frame, start + w.index * stagger, WORD_SPRING);
            const fade = progress(frame, start + w.index * stagger, 8, EASE.out);
            const exit = exitAt === undefined ? 0 : progress(frame, exitAt + w.index * exitStagger, exitDuration, EASE.in);
            const y = (1 - s) * 105 - exit * 105;
            const blur = (1 - fade) * 10 + exit * 8;
            return (
              <span
                key={w.index}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'top',
                  padding: '0.06em 0.12em 0.2em',
                  margin: '-0.06em -0.12em -0.2em',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${y}%) rotate(${(1 - s) * 3}deg)`,
                    transformOrigin: 'left bottom',
                    opacity: fade * (1 - exit),
                    filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                    color: w.accent ? accentColor : color,
                    textShadow: w.accent ? `0 0 28px rgba(230,250,20,0.35)` : undefined,
                    ...wordStyle,
                  }}
                >
                  {w.text}
                </span>
                {wi < line.length - 1 ? '\u00a0' : null}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
