import React from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, progress, springAt, SPRINGS } from '../lib/motion';
import { CUES } from '../timeline';
import { COLORS, FONTS, neon, white } from '../theme';
import { glass } from './glass';

const Corner: React.FC = () => (
  <div style={{ width: 9, height: 9, borderTop: `2px solid ${COLORS.neon}`, borderRight: `2px solid ${COLORS.neon}` }} />
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, letterSpacing: '0.2em', color: white(0.6) }}>
    <Corner />
    {children}
  </div>
);

const panelMotion = (frame: number, start: number, exitAt: number, dir: number) => {
  const p = springAt(frame, start, SPRINGS.smooth);
  const exit = progress(frame, exitAt, 18, EASE.inOut);
  const fade = progress(frame, exitAt, 15, EASE.out);
  return {
    transform: `translateX(${(1 - p) * dir * 60 + exit * dir * 80}px) translateY(${(1 - p) * 20}px) scale(${(0.94 + 0.06 * p) * (1 - exit * 0.05)})`,
    opacity: Math.min(1, p * 1.5) * (1 - fade),
    filter: exit > 0.01 ? `blur(${exit * 7}px)` : undefined,
  } as React.CSSProperties;
};

export const BrandPanel: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  if (frame < CUES.brandPanel || frame > CUES.panelsOut + 20) return null;
  const swatches = [
    { name: 'Noir', color: '#0b0906', ring: 'rgba(255,255,255,0.25)' },
    { name: 'Gold', color: COLORS.gold, ring: 'rgba(217,180,94,0.6)' },
    { name: 'Ivory', color: COLORS.ivory, ring: 'rgba(255,255,255,0.4)' },
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 360,
        padding: '24px 26px 26px',
        borderRadius: 26,
        ...glass(),
        fontFamily: FONTS.display,
        color: COLORS.white,
        ...panelMotion(frame, CUES.brandPanel, CUES.panelsOut, -1),
      }}
    >
      <Eyebrow>BRAND IDENTITY</Eyebrow>
      <div
        style={{
          marginTop: 18,
          padding: '16px 18px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.luxe,
            fontSize: 30,
            letterSpacing: '0.3em',
            backgroundImage: `linear-gradient(180deg, ${COLORS.goldLight}, ${COLORS.gold} 60%, ${COLORS.goldDeep})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          VISCONT
        </div>
        <div style={{ marginTop: 4, fontSize: 13, letterSpacing: '0.14em', color: white(0.45) }}>PRIMARY LOGOTYPE</div>
      </div>
      <div style={{ marginTop: 18, fontSize: 12, letterSpacing: '0.18em', color: white(0.45) }}>COLOR PALETTE</div>
      <div style={{ display: 'flex', gap: 22, marginTop: 12 }}>
        {swatches.map((s, i) => {
          const p = springAt(frame, CUES.brandPanel + 6 + i * 4, SPRINGS.pop);
          return (
            <div key={s.name} style={{ textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: s.color, border: `2px solid ${s.ring}`, transform: `scale(${p})` }} />
              <div style={{ marginTop: 8, fontSize: 13, color: white(0.6), opacity: p }}>{s.name}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        {[
          { aa: 'Aa', name: 'MONTSERRAT', font: FONTS.luxe },
          { aa: 'Aa', name: 'INTER', font: FONTS.display },
        ].map((t, i) => (
          <div
            key={t.name}
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              opacity: progress(frame, CUES.brandPanel + 14 + i * 4, 10),
            }}
          >
            <div style={{ fontFamily: t.font, fontSize: 28, fontWeight: 500 }}>{t.aa}</div>
            <div style={{ marginTop: 2, fontSize: 11, letterSpacing: '0.16em', color: white(0.45) }}>{t.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

type Token = [string, string];
const K = COLORS.neon;
const P = 'rgba(255,255,255,0.5)';
const T = '#62d6c8';
const A = '#b7e36b';
const S = '#f1d58e';
const N = 'rgba(255,255,255,0.92)';

const CODE: Token[][] = [
  [['export default function ', K], ['Home', N], ['() {', P]],
  [['  return ', K], ['(', P]],
  [['    <', P], ['Storefront', T]],
  [['      brand', A], ['=', P], ['"Viscont"', S]],
  [['      motion', A], ['=', P], ['"immersive"', S]],
  [['      seo', A], ['={{ ', P], ['schema', A], [': ', P], ['true', K], [' }}', P]],
  [['    />', P]],
  [['  );', P]],
  [['}', P]],
];

const TOTAL_CHARS = CODE.reduce((sum, line) => sum + line.reduce((s, [t]) => s + t.length, 0), 0);

export const CodePanel: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  if (frame < CUES.codePanel || frame > CUES.panelsOut + 20) return null;
  const typed = Math.floor(progress(frame, CUES.codeTyping, CUES.codeTypingFrames, (t) => t) * TOTAL_CHARS);
  let budget = typed;
  let caretPlaced = false;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 430,
        borderRadius: 24,
        ...glass(),
        overflow: 'hidden',
        fontFamily: FONTS.display,
        ...panelMotion(frame, CUES.codePanel, CUES.panelsOut, 1),
      }}
    >
      <div
        style={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', gap: 7 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: white(0.18) }} />
            ))}
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: white(0.6) }}>app/page.tsx</span>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: COLORS.neon,
            padding: '5px 10px',
            borderRadius: 999,
            background: neon(0.1),
            border: `1px solid ${neon(0.3)}`,
          }}
        >
          NEXT.JS
        </span>
      </div>
      <div style={{ padding: '18px 22px 22px', fontFamily: FONTS.mono, fontSize: 17, lineHeight: 1.62, whiteSpace: 'pre' }}>
        {CODE.map((line, li) => (
          <div key={li} style={{ display: 'flex', minHeight: '1.62em' }}>
            <span style={{ width: 26, color: white(0.2), fontSize: 13, paddingTop: 2 }}>{li + 1}</span>
            {line.map(([text, color], ti) => {
              const shown = text.slice(0, Math.max(0, budget));
              budget -= text.length;
              const showCaret = !caretPlaced && budget < 0;
              if (showCaret) caretPlaced = true;
              return (
                <span key={ti} style={{ color }}>
                  {shown}
                  {showCaret ? <span style={{ display: 'inline-block', width: 9, height: 19, marginBottom: -3, background: COLORS.neon }} /> : null}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
