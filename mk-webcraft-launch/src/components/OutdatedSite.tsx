import React from 'react';
import { interpolate, random, useCurrentFrame } from 'remotion';
import { CUES } from '../timeline';
import { FONTS } from '../theme';

export const SITE_W = 1180;
export const SITE_H = 608;

// Layout anchors (site coordinates) used by the problem callouts.
export const OUTDATED_ANCHORS = {
  loadBar: { x: 300, y: 3 },
  logo: { x: 218, y: 80 },
  heading: { x: 790, y: 66 },
  nav: { x: 880, y: 148 },
  button: { x: 430, y: 431 },
};

const chunk = (frame: number, at: number) => (frame >= at ? 1 : 0);

const ClipartGem: React.FC = () => (
  <svg width="64" height="56" viewBox="0 0 64 56">
    <defs>
      <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e9eef7" />
        <stop offset="1" stopColor="#8ea3c4" />
      </linearGradient>
    </defs>
    <path d="M14 4h36l12 14L32 54 2 18 14 4Z" fill="url(#gem)" stroke="#33466b" strokeWidth="2" />
    <path d="M2 18h60M14 4l8 14 10 36 10-36 8-14M22 18 32 4l10 14" fill="none" stroke="#33466b" strokeWidth="1.4" />
  </svg>
);

export const OutdatedSite: React.FC = () => {
  const frame = useCurrentFrame();
  const [c1, c2, c3] = CUES.siteChunks.map((at) => chunk(frame, at));

  const load = interpolate(frame, [CUES.siteChunks[0], 205, 300], [0.04, 0.33, 0.38], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glitchOn = frame >= CUES.glitch && frame < CUES.glitch + 7;
  const jx = glitchOn ? (random(`gx-${frame}`) - 0.5) * 14 : 0;
  const jy = glitchOn ? (random(`gy-${frame}`) - 0.5) * 6 : 0;
  const decay = interpolate(frame, [CUES.glitch, CUES.glitch + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        width: SITE_W,
        height: SITE_H,
        background: '#c9c9c9',
        overflow: 'hidden',
        fontFamily: FONTS.legacy,
        filter: `saturate(${1 - decay * 0.45}) contrast(${1 - decay * 0.06})`,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, height: 4, width: SITE_W * load, background: '#2f6fdc' }} />

      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 28,
          width: 860,
          height: 548,
          background: '#ffffff',
          border: '1px solid #9a9a9a',
          transform: `translate(${jx}px, ${jy}px)`,
          textShadow: glitchOn ? '2px 0 rgba(255,0,60,0.55), -2px 0 rgba(0,200,255,0.55)' : undefined,
        }}
      >
        <div style={{ opacity: c1 }}>
          <div
            style={{
              height: 100,
              background: 'linear-gradient(180deg, #6d8fc4 0%, #3d5f97 55%, #2a4677 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '0 26px',
              borderBottom: '3px ridge #c6d2e6',
            }}
          >
            <ClipartGem />
            <div>
              <div style={{ fontSize: 38, fontWeight: 700, color: '#fff', textShadow: '2px 2px 0 #1c2f52', letterSpacing: 0.5 }}>
                Welcome to Our Jewellery Shop!
              </div>
              <div style={{ fontSize: 17, fontStyle: 'italic', color: '#dbe5f5', marginTop: 4 }}>Gold &bull; Silver &bull; Diamonds &mdash; Since 1998</div>
            </div>
          </div>
          <div
            style={{
              height: 34,
              background: 'linear-gradient(#f4f4f4, #d9d9d9)',
              borderBottom: '1px solid #a8a8a8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontSize: 15,
              color: '#1a3fbf',
            }}
          >
            {['Home', 'About Us', 'Products', 'Gallery', 'Downloads', 'Guestbook', 'Contact Us'].map((item, i) => (
              <React.Fragment key={item}>
                {i > 0 ? <span style={{ color: '#777' }}>|</span> : null}
                <span style={{ textDecoration: 'underline' }}>{item}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', opacity: c2 }}>
          <div style={{ width: 196, height: 384, background: '#f3f0dc', borderRight: '1px solid #c8c2a0', padding: '16px 14px', fontSize: 15, color: '#333' }}>
            <div style={{ fontWeight: 700, color: '#7a1f1f', marginBottom: 10 }}>Categories</div>
            {['Gold Rings', 'Necklaces', 'Bangles', 'Special Offers!!', 'Price List (PDF)'].map((item) => (
              <div key={item} style={{ marginBottom: 9, color: '#1a3fbf', textDecoration: 'underline' }}>
                &raquo; {item}
              </div>
            ))}
            <div style={{ marginTop: 26, fontSize: 12, color: '#555' }}>Visitors:</div>
            <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
              {'001274'.split('').map((d, i) => (
                <span key={i} style={{ background: '#111', color: '#5f5', fontFamily: FONTS.mono, fontSize: 13, padding: '1px 4px' }}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, padding: '14px 22px', fontSize: 15, color: '#555' }}>
            <div style={{ color: '#d10000', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <span style={{ display: 'inline-block', transform: `translateX(${200 - ((frame * 3) % 900)}px)` }}>
                *** Festival Offer!!! Call now for the best prices in town *** Visit our showroom ***
              </span>
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 14, opacity: c3 }}>
              <div
                style={{
                  width: 270,
                  height: 180,
                  background: '#e6e6e6',
                  border: '1px solid #b5b5b5',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                  padding: 8,
                  fontSize: 12,
                  color: '#888',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <rect x="1" y="1" width="14" height="14" fill="#fff" stroke="#999" />
                  <path d="M3 12 6 8l2 2 2-3 3 5H3Z" fill="#c33" />
                </svg>
                ring_photo_final2.jpg
              </div>
              <div style={{ flex: 1, lineHeight: 1.35 }}>
                <div style={{ fontWeight: 700, color: '#222', fontSize: 18, marginBottom: 6 }}>Best Quality Jewellery</div>
                We are one of the leading jewellery shops. We have a wide range of products for all occasions. Please call us or visit for more details and price.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22, opacity: c3 }}>
              <div
                style={{
                  padding: '5px 16px',
                  fontSize: 14,
                  color: '#000',
                  background: 'linear-gradient(#f7f7f7, #cfcfcf)',
                  border: '2px outset #bdbdbd',
                }}
              >
                Click Here!
              </div>
              <span style={{ fontSize: 12, color: '#999' }}>for more information</span>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 28,
            background: '#e4e4e4',
            borderTop: '1px solid #b5b5b5',
            fontSize: 11,
            color: '#777',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: c3,
          }}
        >
          &copy; 2009 All Rights Reserved &nbsp;|&nbsp; Best viewed in 1024&times;768
        </div>
      </div>
    </div>
  );
};
