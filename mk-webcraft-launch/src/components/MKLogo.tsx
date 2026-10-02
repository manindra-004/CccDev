import React from 'react';
import { getLength, getPointAtLength } from '@remotion/paths';
import { Img, staticFile } from 'remotion';
import { LOGO_BASE_COLOR, LOGO_HIGHLIGHT, LOGO_PARTS, LOGO_TONES, LOGO_VIEWBOX } from '../logo/mkLogoPaths';
import { COLORS } from '../theme';

// Crop of the 712×712 artwork around the mark.
export const LOGO_BOX = { x: 30, y: 95, w: 666, h: 558 };
export const LOGO_ASPECT = LOGO_BOX.w / LOGO_BOX.h;

const SILHOUETTE = LOGO_PARTS.map((p) => p.d).join(' ');
const LENGTHS = LOGO_PARTS.map((p) => getLength(p.d));
const VIEWBOX = `${LOGO_BOX.x} ${LOGO_BOX.y} ${LOGO_BOX.w} ${LOGO_BOX.h}`;

type Props = {
  height: number;
  // 0..1 progress of each layer of the reveal.
  draw: number;
  fill: number;
  sweep: number;
  raster: number;
  glow: number;
  strokeAlpha: number;
  id?: string;
};

export const MKLogo: React.FC<Props> = ({ height, draw, fill, sweep, raster, glow, strokeAlpha, id = 'mk' }) => {
  const width = height * LOGO_ASPECT;
  const k = height / LOGO_BOX.h;
  const edge = fill * 1.45 - 0.22;
  const sweepX = LOGO_BOX.x - 260 + sweep * (LOGO_BOX.w + 520);
  const svgStyle: React.CSSProperties = { position: 'absolute', left: 0, top: 0, overflow: 'visible', display: 'block' };

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height} viewBox={VIEWBOX} style={svgStyle}>
        <defs>
          <clipPath id={`${id}-clip`}>
            <path d={SILHOUETTE} />
          </clipPath>
          <linearGradient id={`${id}-reveal-grad`} x1="0" y1="1" x2="1" y2="0">
            <stop offset={Math.min(1, Math.max(0, edge - 0.18))} stopColor="#fff" />
            <stop offset={Math.min(1, Math.max(0, edge))} stopColor="#000" />
          </linearGradient>
          <mask id={`${id}-reveal`} maskUnits="userSpaceOnUse" x={0} y={0} width={LOGO_VIEWBOX.width} height={LOGO_VIEWBOX.height}>
            <rect x={LOGO_BOX.x} y={LOGO_BOX.y} width={LOGO_BOX.w} height={LOGO_BOX.h} fill={`url(#${id}-reveal-grad)`} />
          </mask>
          <filter id={`${id}-soft`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <linearGradient id={`${id}-glow-grad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={COLORS.logoYellow} />
            <stop offset="1" stopColor={COLORS.logoTeal} />
          </linearGradient>
        </defs>

        {glow > 0 ? <path d={SILHOUETTE} fill={`url(#${id}-glow-grad)`} filter={`url(#${id}-glow)`} opacity={0.55 * glow} /> : null}

        {fill > 0 && raster < 1 ? (
          <g clipPath={`url(#${id}-clip)`} mask={fill < 1 ? `url(#${id}-reveal)` : undefined}>
            <path d={SILHOUETTE} fill={LOGO_BASE_COLOR} />
            <g filter={`url(#${id}-soft)`}>
              {LOGO_TONES.map((t) => (
                <path key={t.threshold} d={t.d} fill={t.color} />
              ))}
            </g>
            <path d={LOGO_HIGHLIGHT.d} fill={LOGO_HIGHLIGHT.color} opacity={0.9} />
          </g>
        ) : null}
      </svg>

      {raster > 0 ? (
        <Img
          src={staticFile('images/mk-logo.png')}
          style={{
            position: 'absolute',
            left: -LOGO_BOX.x * k,
            top: -LOGO_BOX.y * k,
            width: LOGO_VIEWBOX.width * k,
            height: LOGO_VIEWBOX.height * k,
            opacity: raster,
          }}
        />
      ) : null}

      <svg width={width} height={height} viewBox={VIEWBOX} style={svgStyle}>
        <defs>
          <clipPath id={`${id}-clip-top`}>
            <path d={SILHOUETTE} />
          </clipPath>
          <filter id={`${id}-line-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`${id}-sweep-grad`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {sweep > 0 && sweep < 1 ? (
          <g clipPath={`url(#${id}-clip-top)`} style={{ mixBlendMode: 'screen' }}>
            <rect
              x={sweepX}
              y={LOGO_BOX.y - 220}
              width={150}
              height={LOGO_BOX.h + 440}
              fill={`url(#${id}-sweep-grad)`}
              transform={`rotate(22 ${sweepX + 75} ${LOGO_BOX.y + LOGO_BOX.h / 2})`}
            />
          </g>
        ) : null}

        {strokeAlpha > 0 && draw > 0 ? (
          <g filter={`url(#${id}-line-glow)`} opacity={strokeAlpha}>
            {LOGO_PARTS.map((p, i) => (
              <path
                key={p.id}
                d={p.d}
                fill="none"
                stroke={COLORS.neon}
                strokeWidth={2.4}
                strokeLinejoin="round"
                strokeDasharray={LENGTHS[i]}
                strokeDashoffset={LENGTHS[i] * (1 - draw)}
              />
            ))}
          </g>
        ) : null}

        {draw > 0 && draw < 1
          ? LOGO_PARTS.map((p, i) => {
              const pt = getPointAtLength(p.d, LENGTHS[i] * draw);
              if (!pt) return null;
              return (
                <g key={p.id}>
                  <circle cx={pt.x} cy={pt.y} r={16} fill={COLORS.neon} opacity={0.28} filter={`url(#${id}-line-glow)`} />
                  <circle cx={pt.x} cy={pt.y} r={4.5} fill="#fbffe0" />
                </g>
              );
            })
          : null}
      </svg>
    </div>
  );
};
