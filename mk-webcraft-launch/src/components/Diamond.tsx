import React from 'react';
import { random } from 'remotion';

type Props = { size: number; light: number; flare?: number; glow?: number };

const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)] as const;
};

const pts = (list: (readonly [number, number])[]) => list.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

// Top view of a round brilliant cut. `light` (degrees) rotates the light source to make facets sparkle.
export const Diamond: React.FC<Props> = ({ size, light, flare = 0, glow = 1 }) => {
  const R = 50;
  const T = Array.from({ length: 8 }, (_, k) => polar(R * 0.5, 22.5 + 45 * k));
  const S = Array.from({ length: 8 }, (_, k) => polar(R * 0.77, 45 * k));
  const G = Array.from({ length: 16 }, (_, j) => polar(R, 22.5 * j));

  const facets: { poly: (readonly [number, number])[]; angle: number; ring: number }[] = [];
  for (let k = 0; k < 8; k++) {
    const k1 = (k + 1) % 8;
    facets.push({ poly: [T[k], S[k1], T[k1]], angle: 45 * (k + 1), ring: 1 });
    facets.push({ poly: [S[k], T[k], S[k1], G[(2 * k + 1) % 16]], angle: 22.5 + 45 * k, ring: 2 });
    facets.push({ poly: [S[k], G[(2 * k) % 16], G[(2 * k + 1) % 16]], angle: 45 * k + 11.25, ring: 3 });
    facets.push({ poly: [S[k], G[(2 * k + 15) % 16], G[(2 * k) % 16]], angle: 45 * k - 11.25, ring: 3 });
  }

  const shade = (angle: number, ring: number, i: number) => {
    const d = ((angle - light) * Math.PI) / 180;
    const base = 0.32 + 0.38 * Math.cos(2 * d + ring) + 0.3 * Math.cos(5 * d - ring * 0.7);
    const v = Math.min(1, Math.max(0, base * 0.85 + random(`facet-${i}`) * 0.3));
    const tint = random(`tint-${i}`);
    const c = Math.round(28 + v * 227);
    if (v > 0.82) return `rgb(255,255,255)`;
    if (tint > 0.82) return `rgb(${Math.min(255, c + 40)},${Math.min(255, c + 18)},${Math.max(0, c - 30)})`;
    if (tint < 0.14) return `rgb(${Math.max(0, c - 30)},${Math.min(255, c + 6)},${Math.min(255, c + 40)})`;
    return `rgb(${c},${c},${Math.min(255, c + 6)})`;
  };

  const tableShade = (() => {
    const v = 0.55 + 0.35 * Math.cos(((light * 2) * Math.PI) / 180);
    const c = Math.round(40 + v * 200);
    return `rgb(${c},${c},${c + 4})`;
  })();

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.55,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,196,110,0.45) 0%, rgba(217,180,94,0.16) 35%, rgba(217,180,94,0) 65%)',
          opacity: glow,
        }}
      />
      <svg width={size} height={size} viewBox="-52 -52 104 104" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <circle r={R} fill="#20232a" />
        <polygon points={pts(T)} fill={tableShade} stroke="rgba(255,255,255,0.55)" strokeWidth={0.5} />
        {facets.map((f, i) => (
          <polygon key={i} points={pts(f.poly)} fill={shade(f.angle, f.ring, i)} stroke="rgba(255,255,255,0.45)" strokeWidth={0.45} strokeLinejoin="round" />
        ))}
        <circle r={R} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={0.9} />
        <circle r={R} fill="url(#diamond-sheen)" />
        <defs>
          <radialGradient id="diamond-sheen" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {flare > 0 ? (
          <g transform={`translate(-18 -20) scale(${flare})`} opacity={Math.min(1, flare)}>
            <path d="M0 -26 L2.2 -2.2 L26 0 L2.2 2.2 L0 26 L-2.2 2.2 L-26 0 L-2.2 -2.2 Z" fill="#ffffff" />
            <circle r={4} fill="#ffffff" />
          </g>
        ) : null}
      </svg>
    </div>
  );
};
