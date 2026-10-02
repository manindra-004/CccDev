import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { clamp01, EASE, mix, progress, springAt, SPRINGS } from '../lib/motion';
import { CUES, SEARCH_QUERY, TYPE_END } from '../timeline';
import { COLORS, FONTS, neon, white } from '../theme';
import { BlueprintBase, BlueprintOverlay } from './Blueprint';
import { LockIcon, SearchIcon, WarningIcon } from './Icons';
import { OutdatedSite, SITE_W } from './OutdatedSite';
import { ViscontSite } from './ViscontSite';

export const WINDOW_W = 1180;
export const WINDOW_H = 660;
export const CHROME_H = 52;
const PILL = { cx: 960, cy: 668, w: 860, h: 78 };

const clampOpts = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Collapse into the point of light: a short outward breath (anticipation), then an accelerating pull inward.
export const collapseAt = (frame: number) => {
  const t = clamp01((frame - CUES.collapse) / CUES.collapseFrames);
  const breath = t < 0.28 ? Math.sin((t / 0.28) * Math.PI) * 0.03 : 0;
  const inward = t < 0.12 ? 0 : ((t - 0.12) / 0.88) ** 2;
  // Stays visible while it shrinks, then vanishes into the light as the logo outline starts to trace.
  return { breath, inward, alpha: 1 - clamp01((inward - 0.35) / 0.65) };
};

export const COLLAPSE_POINT = { x: 960, y: 535 };

// Placement of the finished window in each scene (centre + scale), shared with overlays.
export const windowPlacement = (frame: number) => {
  const toCraft = progress(frame, CUES.beam, 40, EASE.inOut);
  const toDevices = springAt(frame, CUES.toDevices, SPRINGS.glide);
  const { breath, inward: collapse, alpha } = collapseAt(frame);
  const scale = mix(mix(1, 0.9, toCraft), 0.72, toDevices) * (1 + breath) * mix(1, 0.18, collapse);
  const cx = 960;
  const cy = mix(mix(mix(615, 618, toCraft), 600, toDevices), COLLAPSE_POINT.y, collapse);
  return { cx, cy, scale, toDevices, collapse, breath, alpha };
};

const Spinner: React.FC<{ frame: number; color: string; size?: number }> = ({ frame, color, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" style={{ transform: `rotate(${frame * 14}deg)` }}>
    <circle cx="10" cy="10" r="7.5" fill="none" stroke={white(0.12)} strokeWidth="2.4" />
    <path d="M10 2.5a7.5 7.5 0 0 1 7.5 7.5" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const AddressContent: React.FC<{ frame: number }> = ({ frame }) => {
  const building = frame >= CUES.beam + 20 && frame < CUES.secure;
  const secure = frame >= CUES.secure;
  const pulse = progress(frame, CUES.secure, 18, EASE.out);
  const loadingOld = frame < CUES.beam + 20;

  if (secure) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <LockIcon size={17} color={COLORS.neon} strokeWidth={2} />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 34,
              height: 34,
              marginLeft: -17,
              marginTop: -17,
              borderRadius: '50%',
              border: `1.5px solid ${neon(0.7 * (1 - pulse))}`,
              transform: `scale(${0.4 + pulse * 1.4})`,
            }}
          />
        </div>
        <span style={{ color: white(0.9), fontWeight: 500 }}>viscont.in</span>
      </div>
    );
  }
  if (building) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Spinner frame={frame} color={COLORS.neon} size={15} />
        <span style={{ color: white(0.75), fontFamily: FONTS.mono, fontSize: 14 }}>localhost:3000</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <WarningIcon size={16} color={COLORS.issue} strokeWidth={2} />
      <span style={{ color: COLORS.issue, fontWeight: 500 }}>Not secure</span>
      <div style={{ width: 1, height: 14, background: white(0.15) }} />
      <div style={{ width: 150, height: 8, borderRadius: 4, background: white(0.14) }} />
      {loadingOld ? <Spinner frame={frame} color={white(0.6)} size={15} /> : null}
    </div>
  );
};

export const HeroWindow: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CUES.caretIn || frame > CUES.collapse + 30) return null;

  const open = springAt(frame, CUES.pillOpen, { damping: 18, stiffness: 110, mass: 1 });
  // Two-stage morph: the search bar rises and shrinks into the address-bar slot while the window chrome
  // grows out around it, then the page body drops down from the chrome.
  const widen = springAt(frame, CUES.morph, { damping: 22, stiffness: 120, mass: 1 });
  const morph = springAt(frame, CUES.morph + 6, { damping: 24, stiffness: 85, mass: 1 });
  const press = frame >= CUES.enter && frame < CUES.enter + 10 ? Math.sin(((frame - CUES.enter) / 10) * Math.PI) : 0;
  const ripple = progress(frame, CUES.enter, 22, EASE.out);
  const { cx, cy, scale, toDevices, collapse, alpha } = windowPlacement(frame);

  const pillW = mix(4, PILL.w, open);
  const w = mix(pillW, WINDOW_W, widen);
  const h = mix(mix(PILL.h, CHROME_H, widen), WINDOW_H, morph);
  const x = mix(PILL.cx, cx, widen) - w / 2;
  const y = mix(PILL.cy - PILL.h / 2, cy - WINDOW_H / 2, widen);
  const radius = mix(PILL.h / 2, 18, morph);

  const abW = 520;
  const abWidth = mix(pillW, abW, widen);
  const ab = {
    x: (w - abWidth) / 2,
    y: mix(0, 9, widen),
    w: abWidth,
    h: mix(PILL.h, 34, widen),
    r: mix(PILL.h / 2, 17, widen),
  };

  const typed = Math.max(0, Math.min(SEARCH_QUERY.length, Math.floor((frame - CUES.typeStart) / CUES.typeFramesPerChar)));
  const caretOn = frame < CUES.typeStart || frame > TYPE_END ? Math.floor(frame / 9) % 2 === 0 : true;
  const caretIn = progress(frame, CUES.caretIn, 6);
  const focus = interpolate(frame, [CUES.pillOpen + 6, CUES.pillOpen + 20, CUES.morph, CUES.morph + 10], [0, 1, 1, 0], clampOpts);

  const glassAlpha = Math.max(Math.min(1, open * 2.5), morph);
  const searchAlpha = (1 - progress(frame, CUES.morph + 2, 8, EASE.out)) * interpolate(open, [0.35, 0.8], [0, 1], clampOpts);
  const loneCaret = 1 - interpolate(open, [0, 0.3], [0, 1], clampOpts);
  const urlAlpha = progress(frame, CUES.morph + 9, 12, EASE.out);
  const frameAlpha = progress(frame, CUES.morph, 12, EASE.out);

  const beamP = progress(frame, CUES.beam, CUES.beamEnd - CUES.beam, EASE.inOut);
  const beamX = mix(-60, SITE_W + 60, beamP);
  const showOld = frame < CUES.beamEnd;
  const showNew = frame >= CUES.beam;
  const contentScale = w / WINDOW_W;
  const beamGlow = interpolate(frame, [CUES.beam, CUES.beam + 6, CUES.beamEnd - 4, CUES.beamEnd + 4], [0, 1, 1, 0], clampOpts);

  const bezel = progress(frame, CUES.toDevices + 4, 10, EASE.out);
  const bezelGrow = springAt(frame, CUES.toDevices + 4, SPRINGS.smooth);
  const inset = 22 * bezelGrow;
  const base = springAt(frame, CUES.toDevices + 12, SPRINGS.smooth);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        transform: morph > 0.999 ? `translate(${cx}px, ${cy}px) scale(${scale}) translate(${-cx}px, ${-cy}px)` : undefined,
        transformOrigin: '0 0',
        opacity: alpha,
        filter: collapse > 0.01 ? `blur(${collapse * 10}px)` : undefined,
      }}
    >
      {toDevices > 0.01 ? (
        <>
          {/* The base is painted before the bezel so it slides out from behind the screen. */}
          <div
            style={{
              position: 'absolute',
              left: cx - WINDOW_W / 2 - inset - 110,
              width: WINDOW_W + inset * 2 + 220,
              top: cy + WINDOW_H / 2 + inset,
              height: 30,
              borderRadius: '4px 4px 26px 26px',
              background: 'linear-gradient(180deg, #4a4a4f 0%, #2a2a2e 45%, #141416 100%)',
              borderTop: '1px solid rgba(255,255,255,0.25)',
              transform: `translateY(${(1 - base) * -24}px) scaleX(${0.82 + 0.18 * base})`,
              opacity: Math.min(1, base * 1.4),
            }}
          >
            <div style={{ position: 'absolute', left: '50%', top: 0, width: 220, height: 10, marginLeft: -110, borderRadius: '0 0 10px 10px', background: '#1a1a1d' }} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: cx - WINDOW_W / 2 - inset,
              top: cy - WINDOW_H / 2 - inset,
              width: WINDOW_W + inset * 2,
              height: WINDOW_H + inset * 2,
              borderRadius: 18 + inset * (16 / 22),
              background: 'linear-gradient(180deg, #1b1b1e, #0d0d0f)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 60px 160px rgba(0,0,0,0.7)',
              opacity: bezel,
            }}
          />
        </>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: radius,
          transform: press > 0 ? `scale(${1 - press * 0.012})` : undefined,
          opacity: caretIn,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius,
            overflow: 'hidden',
            background: `rgba(16,16,18,${frameAlpha})`,
            border: `1px solid rgba(255,255,255,${0.11 * frameAlpha})`,
            boxShadow: frameAlpha > 0 ? `0 50px 140px rgba(0,0,0,${0.62 * frameAlpha})` : undefined,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: CHROME_H,
              background: 'linear-gradient(180deg, #1c1c1f, #151517)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              opacity: frameAlpha,
            }}
          >
            <div style={{ position: 'absolute', left: 22, top: 20, display: 'flex', gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: white(0.16) }} />
              ))}
            </div>
            <div style={{ position: 'absolute', right: 22, top: 17, display: 'flex', gap: 10 }}>
              {[0, 1].map((i) => (
                <div key={i} style={{ width: 18, height: 18, borderRadius: 5, background: white(0.08) }} />
              ))}
            </div>
          </div>

          {frameAlpha > 0 ? (
            <div style={{ position: 'absolute', left: 0, top: CHROME_H, width: w, height: (WINDOW_H - CHROME_H) * morph, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: SITE_W, height: 608, transform: `scale(${contentScale})`, transformOrigin: '0 0' }}>
                {showOld ? (
                  <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${Math.max(0, beamX)}px)` }}>
                    <OutdatedSite />
                  </div>
                ) : null}
                {showNew ? (
                  <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${Math.max(0, SITE_W - beamX)}px 0 0)` }}>
                    <BlueprintBase />
                    <ViscontSite layout="desktop" build />
                    <BlueprintOverlay />
                  </div>
                ) : null}
                {beamGlow > 0 ? (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: beamX - 220,
                        width: 220,
                        background: `linear-gradient(90deg, ${neon(0)}, ${neon(0.16)})`,
                        opacity: beamGlow,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: beamX - 2,
                        width: 4,
                        background: '#fbffd0',
                        boxShadow: `0 0 18px 6px ${neon(0.85)}, 0 0 70px 24px ${neon(0.35)}`,
                        opacity: beamGlow,
                      }}
                    />
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div
          style={{
            position: 'absolute',
            left: ab.x,
            top: ab.y,
            width: ab.w,
            height: ab.h,
            borderRadius: ab.r,
            background: `linear-gradient(180deg, rgba(255,255,255,${mix(0.1, 0.06, widen) * glassAlpha}), rgba(255,255,255,${mix(0.04, 0.05, widen) * glassAlpha}))`,
            border: `1px solid rgba(255,255,255,${mix(0.16, 0.08, widen) * glassAlpha})`,
            boxShadow: [
              `0 24px 70px rgba(0,0,0,${0.55 * (1 - widen) * glassAlpha})`,
              `inset 0 1px 0 rgba(255,255,255,${0.12 * (1 - widen) * glassAlpha})`,
              `0 0 0 1px ${neon(0.38 * focus)}`,
              `0 0 46px ${neon(0.14 * focus)}`,
            ].join(', '),
            overflow: 'hidden',
            fontFamily: FONTS.display,
          }}
        >
          {searchAlpha > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: mix(30, 16, widen),
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                opacity: searchAlpha,
                whiteSpace: 'nowrap',
                transform: `scale(${mix(1, 0.5, widen)})`,
                transformOrigin: '0 50%',
              }}
            >
              <SearchIcon size={28} color={white(0.62)} strokeWidth={2} />
              <span style={{ fontSize: 30, color: white(0.94), letterSpacing: '-0.01em' }}>{SEARCH_QUERY.slice(0, typed)}</span>
              <div style={{ width: 2.5, height: 36, marginLeft: -14, background: COLORS.neon, opacity: caretOn ? 1 : 0, boxShadow: `0 0 12px ${neon(0.8)}` }} />
            </div>
          ) : null}
          {loneCaret > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 3,
                height: 38,
                marginLeft: -1.5,
                marginTop: -19,
                background: COLORS.neon,
                boxShadow: `0 0 14px ${neon(0.9)}`,
                opacity: (caretOn ? 1 : 0.15) * loneCaret,
              }}
            />
          ) : null}
          {urlAlpha > 0 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                opacity: urlAlpha,
              }}
            >
              <AddressContent frame={frame} />
            </div>
          ) : null}
        </div>

        {ripple > 0 && ripple < 1 ? (
          <div
            style={{
              position: 'absolute',
              inset: -ripple * 26,
              borderRadius: radius + ripple * 26,
              border: `1.5px solid ${neon(0.55 * (1 - ripple))}`,
              pointerEvents: 'none',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
