import React from 'react';
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';
import { cameraAt, parallax } from '../lib/camera';
import { COLORS } from '../theme';

const keys = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);
  const t = frame / 30;

  // Brand glow mood across the story: dim and cold for the problem, neon for the craft.
  const neonGlow = keys(frame, [0, 40, 170, 200, 300, 345, 560, 686, 716, 724, 760, 900], [0, 0.55, 0.5, 0.18, 0.2, 0.75, 0.85, 0.85, 0.05, 0.55, 0.32, 0.3]);
  const tealGlow = keys(frame, [0, 40, 170, 200, 300, 345, 686, 716, 724, 760], [0, 0.4, 0.4, 0.15, 0.15, 0.5, 0.6, 0.05, 0.45, 0.28]);
  const coldWash = keys(frame, [170, 205, 300, 340], [0, 1, 1, 0]);
  const gridAlpha = keys(frame, [0, 40, 300, 340, 690, 718, 760], [0, 0.6, 0.45, 0.9, 0.7, 0, 0.35]);
  const centred = keys(frame, [686, 718], [0, 1]);

  const nx = noise2D('glow-a', t * 0.08, 0) * 140;
  const ny = noise2D('glow-a', 0, t * 0.08) * 90;
  const tx = noise2D('glow-b', t * 0.07, 3) * 140;
  const ty = noise2D('glow-b', 3, t * 0.07) * 90;

  const neonX = interpolate(centred, [0, 1], [420 + nx, 960]);
  const neonY = interpolate(centred, [0, 1], [260 + ny, 470]);
  const tealX = interpolate(centred, [0, 1], [1500 + tx, 1010]);
  const tealY = interpolate(centred, [0, 1], [860 + ty, 600]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, overflow: 'hidden' }}>
      <AbsoluteFill style={parallax(cam, 0.25)}>
        <div
          style={{
            position: 'absolute',
            left: neonX - 900,
            top: neonY - 900,
            width: 1800,
            height: 1800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(230,250,20,0.16) 0%, rgba(230,250,20,0.06) 32%, rgba(230,250,20,0) 62%)',
            opacity: neonGlow,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: tealX - 900,
            top: tealY - 900,
            width: 1800,
            height: 1800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,143,137,0.22) 0%, rgba(14,143,137,0.08) 34%, rgba(14,143,137,0) 64%)',
            opacity: tealGlow,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: -200,
            background: 'radial-gradient(ellipse at 50% 45%, rgba(150,165,185,0.10), rgba(150,165,185,0) 60%)',
            opacity: coldWash,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={parallax(cam, 0.45)}>
        <div
          style={{
            position: 'absolute',
            inset: -160,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            backgroundPosition: `${-t * 6}px ${-t * 3}px`,
            maskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, black 10%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, black 10%, transparent 75%)',
            opacity: gridAlpha,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Lens vignette and animated film grain, composited above every scene.
export const FilmFinish: React.FC = () => {
  const frame = useCurrentFrame();
  const grainX = Math.floor(random(`grain-x-${frame}`) * 256);
  const grainY = Math.floor(random(`grain-y-${frame}`) * 256);
  return (
    <>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 78% 72% at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.62) 100%)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('images/grain.png')})`,
          backgroundPosition: `${grainX}px ${grainY}px`,
          opacity: 0.045,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};
