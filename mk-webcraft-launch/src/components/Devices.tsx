import React from 'react';
import { white } from '../theme';
import { VISCONT_SIZE, ViscontSite } from './ViscontSite';

export const TABLET = { w: 320, bezel: 14, radius: 30 };
const tabletScale = (TABLET.w - TABLET.bezel * 2) / VISCONT_SIZE.tablet.w;
export const TABLET_H = VISCONT_SIZE.tablet.h * tabletScale + TABLET.bezel * 2;

export const PHONE = { w: 216, bezel: 9, radius: 38, status: 26 };
const phoneScale = (PHONE.w - PHONE.bezel * 2) / VISCONT_SIZE.mobile.w;
export const PHONE_H = VISCONT_SIZE.mobile.h * phoneScale + PHONE.status + PHONE.bezel * 2;

const frameStyle = (w: number, h: number, radius: number): React.CSSProperties => ({
  position: 'relative',
  width: w,
  height: h,
  borderRadius: radius,
  background: 'linear-gradient(160deg, #2a2a2e 0%, #0f0f11 40%, #1d1d20 100%)',
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow: '0 50px 120px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(0,0,0,0.6)',
});

export const Tablet: React.FC = () => (
  <div style={frameStyle(TABLET.w, TABLET_H, TABLET.radius)}>
    <div
      style={{
        position: 'absolute',
        left: TABLET.bezel,
        top: TABLET.bezel,
        width: TABLET.w - TABLET.bezel * 2,
        height: TABLET_H - TABLET.bezel * 2,
        borderRadius: TABLET.radius - TABLET.bezel + 4,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <div style={{ transform: `scale(${tabletScale})`, transformOrigin: '0 0', width: VISCONT_SIZE.tablet.w, height: VISCONT_SIZE.tablet.h, position: 'relative' }}>
        <ViscontSite layout="tablet" />
      </div>
    </div>
  </div>
);

export const Phone: React.FC = () => (
  <div style={frameStyle(PHONE.w, PHONE_H, PHONE.radius)}>
    <div
      style={{
        position: 'absolute',
        left: PHONE.bezel,
        top: PHONE.bezel,
        width: PHONE.w - PHONE.bezel * 2,
        height: PHONE_H - PHONE.bezel * 2,
        borderRadius: PHONE.radius - PHONE.bezel,
        overflow: 'hidden',
        background: '#050403',
      }}
    >
      <div
        style={{
          height: PHONE.status,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 600,
          color: white(0.85),
        }}
      >
        <span>9:41</span>
        <div style={{ width: 64, height: 18, borderRadius: 9, background: '#000', border: '1px solid rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', gap: 3 }}>
          {[6, 8, 10].map((hgt) => (
            <div key={hgt} style={{ width: 3, height: hgt, borderRadius: 1, background: white(0.8), alignSelf: 'flex-end' }} />
          ))}
          <div style={{ width: 16, height: 9, borderRadius: 2, border: `1px solid ${white(0.7)}`, marginLeft: 3 }} />
        </div>
      </div>
      <div style={{ transform: `scale(${phoneScale})`, transformOrigin: '0 0', width: VISCONT_SIZE.mobile.w, height: VISCONT_SIZE.mobile.h, position: 'relative' }}>
        <ViscontSite layout="mobile" />
      </div>
    </div>
  </div>
);
