import React from 'react';
import { random, useCurrentFrame } from 'remotion';
import { EASE, progress, springAt, SPRINGS } from '../lib/motion';
import { CUES } from '../timeline';
import { COLORS, FONTS } from '../theme';
import { Diamond } from './Diamond';
import { BagIcon, MenuIcon } from './Icons';

// Recreation of viscont.in (Viscont Jewellery, built by MK Webcraft), using the
// real copy from the project page and the hero shown in MK Webcraft's case study.

export type ViscontLayout = 'desktop' | 'tablet' | 'mobile';

const LAYOUTS = {
  desktop: { w: 1180, h: 608, nav: 64, diamondY: 206, diamond: 116, wordY: 262, word: 168, tagY: 420, tag: 14, ctaY: 458, marquee: 56, stars: 46 },
  tablet: { w: 440, h: 586, nav: 58, diamondY: 168, diamond: 92, wordY: 214, word: 78, tagY: 316, tag: 11, ctaY: 378, marquee: 48, stars: 22 },
  mobile: { w: 236, h: 500, nav: 50, diamondY: 140, diamond: 74, wordY: 178, word: 44, tagY: 238, tag: 8.5, ctaY: 312, marquee: 40, stars: 14 },
} as const;

export const VISCONT_SIZE = {
  desktop: { w: LAYOUTS.desktop.w, h: LAYOUTS.desktop.h },
  tablet: { w: LAYOUTS.tablet.w, h: LAYOUTS.tablet.h },
  mobile: { w: LAYOUTS.mobile.w, h: LAYOUTS.mobile.h },
};

const MARQUEE = ['Timeless design', 'Certified quality', 'Lab-grown diamonds', 'Bespoke craftsmanship', 'BIS hallmarked', 'Armored shipping'];

const goldText: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${COLORS.goldLight} 0%, #e8c677 42%, ${COLORS.gold} 62%, ${COLORS.goldDeep} 86%, #e9cf8a 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

type Props = { layout: ViscontLayout; build?: boolean };

export const ViscontSite: React.FC<Props> = ({ layout, build = false }) => {
  const frame = useCurrentFrame();
  const L = LAYOUTS[layout];
  const s = layout === 'desktop' ? 1 : layout === 'tablet' ? 0.62 : 0.4;

  const r = build
    ? {
        bg: progress(frame, CUES.nav - 8, 16),
        nav: springAt(frame, CUES.nav, SPRINGS.smooth),
        diamond: springAt(frame, CUES.diamond, SPRINGS.pop),
        tag: progress(frame, CUES.tagline, 22, EASE.out),
        cta: progress(frame, CUES.tagline + 6, 16, EASE.out),
        marquee: springAt(frame, CUES.marquee, SPRINGS.smooth),
        letter: (i: number) => springAt(frame, CUES.wordmark + i * 2, { damping: 18, stiffness: 140, mass: 0.8 }),
        shine: progress(frame, CUES.wordmark + 14, 26, EASE.inOut),
      }
    : { bg: 1, nav: 1, diamond: 1, tag: 1, cta: 1, marquee: 1, letter: () => 1, shine: 1 };

  const light = frame * 2.4;
  const flarePhase = (frame - CUES.diamond - 6) % 75;
  const flare = r.diamond > 0.9 && flarePhase >= 0 && flarePhase < 18 ? Math.sin((flarePhase / 18) * Math.PI) : 0;
  const word = 'VISCONT';

  return (
    <div
      style={{
        position: 'absolute',
        width: L.w,
        height: L.h,
        overflow: 'hidden',
        fontFamily: FONTS.luxe,
        background: 'radial-gradient(ellipse 75% 62% at 50% 36%, #21190c 0%, #0c0a06 46%, #040404 100%)',
        opacity: r.bg,
      }}
    >
      {Array.from({ length: L.stars }).map((_, i) => {
        const x = random(`star-x-${layout}-${i}`) * L.w;
        const y = random(`star-y-${layout}-${i}`) * (L.h - L.marquee - L.nav) + L.nav;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (14 + (i % 7) * 3) + i));
        const sz = 1 + random(`star-s-${layout}-${i}`) * 1.6;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: '50%', background: '#f3e2b8', opacity: tw * 0.55 * r.bg }} />;
      })}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: L.nav,
          borderBottom: '1px solid rgba(217,180,94,0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `0 ${40 * s + 6}px`,
          color: '#cdbf9f',
          fontSize: 13 * Math.max(s, 0.75),
          fontWeight: 500,
          letterSpacing: '0.06em',
          opacity: r.nav,
          transform: `translateY(${(1 - r.nav) * -14}px)`,
        }}
      >
        {layout === 'desktop' ? (
          <>
            <div style={{ display: 'flex', gap: 30, width: 260 }}>
              <span>Shop</span>
              <span>About</span>
              <span>Lookbook</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <div style={{ width: 1, height: 24, background: 'rgba(217,180,94,0.35)' }} />
              <span style={{ ...goldText, fontSize: 19, letterSpacing: '0.38em', marginRight: '-0.38em' }}>VISCONT</span>
              <div style={{ width: 1, height: 24, background: 'rgba(217,180,94,0.35)' }} />
            </div>
            <div style={{ display: 'flex', gap: 30, width: 260, justifyContent: 'flex-end' }}>
              <span>Login</span>
              <span>Cart (0)</span>
            </div>
          </>
        ) : (
          <>
            <MenuIcon size={22 * s + 8} color="#cdbf9f" />
            <span style={{ ...goldText, fontSize: 30 * s, letterSpacing: '0.34em', marginRight: '-0.34em' }}>VISCONT</span>
            <BagIcon size={22 * s + 8} color="#cdbf9f" />
          </>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: L.w / 2 - L.diamond / 2,
          top: L.diamondY - L.diamond / 2,
          transform: `translateY(${(1 - r.diamond) * -40 * s}px) scale(${0.55 + 0.45 * r.diamond})`,
          opacity: Math.min(1, r.diamond * 1.4),
          zIndex: 2,
        }}
      >
        <Diamond size={L.diamond} light={light} flare={flare} glow={r.diamond} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: L.wordY,
          display: 'flex',
          justifyContent: 'center',
          fontSize: L.word,
          fontWeight: 400,
          letterSpacing: '0.05em',
          lineHeight: 1,
          filter: 'drop-shadow(0 0 22px rgba(217,180,94,0.32))',
        }}
      >
        {word.split('').map((ch, i) => {
          const p = r.letter(i);
          return (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', padding: '0 0.01em 0.08em' }}>
              <span style={{ ...goldText, display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, opacity: Math.min(1, p * 1.5) }}>{ch}</span>
            </span>
          );
        })}
      </div>
      {build && r.shine > 0 && r.shine < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: L.wordY,
            display: 'flex',
            justifyContent: 'center',
            fontSize: L.word,
            fontWeight: 400,
            letterSpacing: '0.05em',
            lineHeight: 1,
            paddingBottom: '0.08em',
            backgroundImage: 'linear-gradient(100deg, rgba(255,250,230,0) 40%, rgba(255,250,230,0.95) 50%, rgba(255,250,230,0) 60%)',
            backgroundSize: '300% 100%',
            backgroundPosition: `${100 - r.shine * 100}% 0`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {word.split('').map((ch, i) => (
            <span key={i} style={{ display: 'inline-block', padding: '0 0.01em' }}>
              {ch}
            </span>
          ))}
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: L.tagY,
          textAlign: 'center',
          color: '#d8ceb8',
          fontSize: L.tag,
          fontWeight: 500,
          letterSpacing: `${0.34 + (1 - r.tag) * 0.3}em`,
          lineHeight: 1.7,
          opacity: r.tag,
          padding: '0 8%',
        }}
      >
        {layout === 'desktop' ? 'TIMELESS JEWELRY CRAFTED FOR MODERN ELEGANCE.' : layout === 'tablet' ? (
          <>
            TIMELESS JEWELRY CRAFTED
            <br />
            FOR MODERN ELEGANCE.
          </>
        ) : (
          <>
            TIMELESS JEWELRY
            <br />
            CRAFTED FOR
            <br />
            MODERN ELEGANCE.
          </>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: L.ctaY,
          transform: `translateX(-50%) translateY(${(1 - r.cta) * 10}px)`,
          opacity: r.cta,
          border: '1px solid rgba(217,180,94,0.65)',
          borderRadius: 999,
          padding: `${11 * s + 3}px ${26 * s + 8}px`,
          color: COLORS.goldLight,
          fontSize: Math.max(7, 11.5 * s + 1),
          fontWeight: 600,
          letterSpacing: '0.24em',
          whiteSpace: 'nowrap',
          background: 'rgba(217,180,94,0.08)',
          boxShadow: '0 0 24px rgba(217,180,94,0.18)',
        }}
      >
        SHOP THE COLLECTION
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: L.marquee,
          borderTop: '1px solid rgba(217,180,94,0.2)',
          background: 'rgba(217,180,94,0.04)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          transform: `translateX(${(1 - r.marquee) * L.w * 0.6}px)`,
          opacity: r.marquee,
        }}
      >
        <div
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            transform: `translateX(${-((frame * 1.1 * Math.max(s, 0.5)) % 900)}px)`,
            color: '#cbb98f',
            fontSize: Math.max(7, 12 * s + 1.5),
            fontWeight: 500,
            letterSpacing: '0.22em',
          }}
        >
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18 * s + 6, marginRight: 18 * s + 6 }}>
              {item.toUpperCase()}
              <span style={{ display: 'inline-block', width: '0.42em', height: '0.42em', background: COLORS.gold, transform: 'rotate(45deg)' }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
