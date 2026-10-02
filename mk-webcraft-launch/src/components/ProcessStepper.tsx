import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { EASE, progress } from '../lib/motion';
import { COLORS, FONTS, neon, white } from '../theme';

// MK Webcraft's own four-step process, as named on mkwebcraft.in.
const STEPS = ['Discover', 'Design', 'Build', 'Launch'];

type Props = { y: number; activations: number[]; start: number; exitAt: number };

export const ProcessStepper: React.FC<Props> = ({ y, activations, start, exitAt }) => {
  const frame = useCurrentFrame();
  const enter = progress(frame, start, 16, EASE.out);
  const exit = progress(frame, exitAt, 12, EASE.in);
  if (enter <= 0 || exit >= 1) return null;

  const stepW = 230;
  const total = stepW * STEPS.length;
  const left = 960 - total / 2;
  const fill = interpolate(frame, [activations[0], activations[1], activations[2], activations[3]], [0.5, 1.5, 2.5, 3.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.inOut,
  });

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: y,
        width: total,
        height: 60,
        opacity: enter * (1 - exit),
        transform: `translateY(${(1 - enter) * 16}px)`,
        fontFamily: FONTS.display,
      }}
    >
      <div style={{ position: 'absolute', left: stepW / 2, right: stepW / 2, top: 9, height: 2, background: white(0.1) }} />
      <div
        style={{
          position: 'absolute',
          left: stepW / 2,
          top: 9,
          height: 2,
          width: Math.max(0, (fill - 0.5) * stepW),
          background: COLORS.neon,
          boxShadow: `0 0 12px ${neon(0.7)}`,
        }}
      />
      {STEPS.map((label, i) => {
        const on = progress(frame, activations[i], 10, EASE.out);
        const current = frame >= activations[i] && (i === STEPS.length - 1 || frame < activations[i + 1]);
        return (
          <div key={label} style={{ position: 'absolute', left: i * stepW, width: stepW, top: 0, textAlign: 'center' }}>
            <div
              style={{
                margin: '0 auto',
                width: 20,
                height: 20,
                borderRadius: 10,
                background: on > 0.5 ? COLORS.neon : '#1a1a1d',
                border: `2px solid ${on > 0.5 ? COLORS.neon : white(0.22)}`,
                boxShadow: current ? `0 0 0 ${6 * on}px ${neon(0.16)}, 0 0 18px ${neon(0.6)}` : undefined,
                transform: `scale(${1 + (current ? 0.12 * on : 0)})`,
              }}
            />
            <div
              style={{
                marginTop: 12,
                fontSize: 21,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: current ? COLORS.white : on > 0.5 ? white(0.62) : white(0.32),
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: current ? COLORS.neon : 'inherit', marginRight: 8 }}>{`0${i + 1}`}</span>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
