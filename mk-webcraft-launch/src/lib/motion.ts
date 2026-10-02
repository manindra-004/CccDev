import { Easing, interpolate, spring, SpringConfig } from 'remotion';
import { FPS } from '../timeline';

// Easing curves lifted from mkwebcraft.in's CSS custom properties.
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  fluid: Easing.bezier(0.3, 0.7, 0.2, 1),
  snappy: Easing.bezier(0.2, 0.8, 0.2, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.75, 0.2),
};

export const SPRINGS = {
  soft: { damping: 200, stiffness: 90, mass: 1 } as Partial<SpringConfig>,
  smooth: { damping: 30, stiffness: 120, mass: 1 } as Partial<SpringConfig>,
  pop: { damping: 14, stiffness: 160, mass: 0.7 } as Partial<SpringConfig>,
  glide: { damping: 22, stiffness: 70, mass: 1.1 } as Partial<SpringConfig>,
};

export const springAt = (frame: number, start: number, config: Partial<SpringConfig> = SPRINGS.smooth, durationInFrames?: number) =>
  spring({ frame: frame - start, fps: FPS, config, durationInFrames });

export const progress = (frame: number, start: number, duration: number, easing: (t: number) => number = EASE.out) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
