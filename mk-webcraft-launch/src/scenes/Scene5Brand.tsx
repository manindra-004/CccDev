import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { KineticTitle } from '../components/KineticTitle';
import { LOGO_ASPECT, MKLogo } from '../components/MKLogo';
import { EASE, mix, progress, springAt, SPRINGS } from '../lib/motion';
import { CUES } from '../timeline';
import { COLORS, FONTS, neon, white } from '../theme';

const clampOpts = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const PARTICLES = 28;

const Wordmark: React.FC<{ frame: number; y: number }> = ({ frame, y }) => {
  const letters = 'MK WEBCRAFT'.split('');
  const reg = progress(frame, CUES.wordmarkIn + 22, 12, EASE.out);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        display: 'flex',
        justifyContent: 'center',
        fontFamily: FONTS.condensed,
        fontSize: 150,
        lineHeight: 1,
        letterSpacing: '0.02em',
        color: COLORS.white,
      }}
    >
      <div style={{ position: 'relative', display: 'flex' }}>
        {letters.map((ch, i) => {
          const p = springAt(frame, CUES.wordmarkIn + i * 1.6, { damping: 18, stiffness: 150, mass: 0.8 });
          const fade = progress(frame, CUES.wordmarkIn + i * 1.6, 8, EASE.out);
          return (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', padding: '0.04em 0 0.02em' }}>
              <span
                style={{
                  display: 'inline-block',
                  minWidth: ch === ' ' ? '0.24em' : undefined,
                  transform: `translateY(${(1 - p) * 105}%)`,
                  opacity: fade,
                  filter: fade < 1 ? `blur(${(1 - fade) * 8}px)` : undefined,
                }}
              >
                {ch}
              </span>
            </span>
          );
        })}
        <span
          style={{
            position: 'absolute',
            right: -34,
            top: 6,
            fontFamily: FONTS.display,
            fontSize: 26,
            fontWeight: 500,
            color: white(0.75),
            opacity: reg,
          }}
        >
          ®
        </span>
      </div>
    </div>
  );
};

const UrlPill: React.FC<{ frame: number; y: number }> = ({ frame, y }) => {
  const p = springAt(frame, CUES.urlIn, SPRINGS.pop);
  const fade = progress(frame, CUES.urlIn, 10, EASE.out);
  const shine = progress(frame, CUES.urlIn + 8, 26, EASE.inOut);
  const breathe = 0.5 + 0.5 * Math.sin((frame - CUES.urlIn) / 14);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '16px 34px 16px 28px',
          borderRadius: 999,
          border: `1px solid ${neon(0.45)}`,
          background: `linear-gradient(180deg, ${neon(0.12)}, ${neon(0.05)})`,
          boxShadow: `0 0 ${36 + breathe * 14}px ${neon(0.14 + breathe * 0.06)}, inset 0 1px 0 ${neon(0.25)}`,
          transform: `translateY(${(1 - p) * 18}px) scale(${0.9 + 0.1 * p})`,
          opacity: fade,
          fontFamily: FONTS.display,
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: COLORS.white,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, background: COLORS.neon, boxShadow: `0 0 14px ${neon(0.9)}` }} />
        mkwebcraft.in
        {shine > 0 && shine < 1 ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${-30 + shine * 160}%`,
              width: '30%',
              background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export const Scene5Brand: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CUES.collapse + 8) return null;

  const point = interpolate(frame, [CUES.collapse + 8, CUES.logoHit - 2, CUES.logoHit], [0, 0.7, 1], clampOpts);
  const flash = progress(frame, CUES.logoHit, 18, EASE.out);
  const ring = progress(frame, CUES.logoHit, 34, EASE.out);
  const settle = springAt(frame, CUES.logoHit, SPRINGS.glide);
  const lock = springAt(frame, CUES.lockup, { damping: 26, stiffness: 90, mass: 1 });

  const draw = progress(frame, CUES.logoHit, 36, EASE.inOut);
  const strokeAlpha = interpolate(frame, [CUES.logoHit, CUES.logoHit + 2, CUES.logoFill + 18, CUES.logoFill + 36], [0, 1, 1, 0], clampOpts);
  const fill = progress(frame, CUES.logoFill, 30, EASE.inOut);
  const glow = interpolate(frame, [CUES.logoFill, CUES.logoFill + 24, CUES.lockup + 20], [0, 1, 0.65], clampOpts) * (0.9 + 0.1 * Math.sin(frame / 16));
  const sweep = progress(frame, CUES.logoSweep, 26, EASE.inOut);
  const raster = progress(frame, CUES.logoSweep + 6, 18, EASE.inOut);

  const height = mix(430, 272, lock) * mix(1.08, 1, settle);
  const width = height * LOGO_ASPECT;
  const cy = mix(530, 358, lock);
  const tilt = (1 - settle) * -3;

  const aura = interpolate(frame, [CUES.logoHit, CUES.logoHit + 10, CUES.logoHit + 60, CUES.lockup + 30], [0, 1, 0.75, 0.55], clampOpts);

  return (
    <AbsoluteFill>
      {frame < CUES.logoHit + 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 960 - 60,
            top: 540 - 60,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, #fbffe0 0%, ${neon(0.9)} 18%, ${neon(0.25)} 40%, ${neon(0)} 70%)`,
            transform: `scale(${point * 1.1})`,
            opacity: point,
          }}
        />
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: 960 - 560,
          top: cy - 560,
          width: 1120,
          height: 1120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230,250,20,0.13) 0%, rgba(150,210,60,0.05) 30%, rgba(14,143,137,0.035) 46%, rgba(14,143,137,0) 64%)',
          opacity: aura,
        }}
      />

      {flash > 0 && flash < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 960 - 400,
            top: 530 - 400,
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,255,235,0.95) 0%, ${neon(0.75)} 6%, ${neon(0.28)} 18%, ${neon(0.08)} 34%, ${neon(0)} 55%)`,
            transform: `scale(${0.25 + flash * 1.2})`,
            opacity: (1 - flash) ** 1.6,
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
      {ring > 0 && ring < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 960 - 300,
            top: 530 - 300,
            width: 600,
            height: 600,
            borderRadius: '50%',
            border: `2px solid ${neon(0.5 * (1 - ring))}`,
            transform: `scale(${0.35 + ring * 1.9})`,
          }}
        />
      ) : null}

      {Array.from({ length: PARTICLES }).map((_, i) => {
        const t = progress(frame, CUES.logoHit + 2, 70 + random(`pl-${i}`) * 30, EASE.out);
        if (t <= 0 || t >= 1) return null;
        const ang = random(`pa-${i}`) * Math.PI * 2;
        const dist = 160 + random(`pd-${i}`) * 420;
        const size = 2 + random(`ps-${i}`) * 3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 960 + Math.cos(ang) * dist * t,
              top: 530 + Math.sin(ang) * dist * t * 0.75,
              width: size,
              height: size,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#ffffff' : COLORS.neon,
              boxShadow: `0 0 8px ${neon(0.8)}`,
              opacity: (1 - t) * 0.85,
            }}
          />
        );
      })}

      {frame >= CUES.logoHit ? (
        <div
          style={{
            position: 'absolute',
            left: 960 - width / 2,
            top: cy - height / 2,
            transform: `rotate(${tilt}deg)`,
          }}
        >
          <MKLogo height={height} draw={draw} fill={fill} sweep={sweep} raster={raster} glow={glow} strokeAlpha={strokeAlpha} />
        </div>
      ) : null}

      {frame >= CUES.wordmarkIn ? <Wordmark frame={frame} y={528} /> : null}

      {frame >= CUES.taglineIn - 2 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 692 }}>
          <KineticTitle
            text="Turning ideas into powerful digital experiences."
            start={CUES.taglineIn}
            stagger={4}
            size={40}
            weight={500}
            tracking="-0.02em"
            color={white(0.78)}
          />
        </div>
      ) : null}

      {frame >= CUES.urlIn ? <UrlPill frame={frame} y={772} /> : null}
    </AbsoluteFill>
  );
};
