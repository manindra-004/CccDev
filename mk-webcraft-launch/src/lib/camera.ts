import { noise2D } from '@remotion/noise';
import { interpolate } from 'remotion';
import { HEIGHT, WIDTH } from '../theme';
import { EASE } from './motion';

export type Camera = { x: number; y: number; zoom: number; rotate: number };

// Continuous camera path. Pull-backs line up with the big transitions so the
// move reads as one deliberate camera rather than a reset.
const ZOOM_KEYS: [number, number][] = [
  [0, 1.0],
  [132, 1.045],
  [178, 1.0],
  [300, 1.03],
  [340, 1.0],
  [530, 1.03],
  [578, 1.0],
  [690, 1.04],
  [718, 1.0],
  [900, 1.035],
];

const PAN_X_KEYS: [number, number][] = [
  [0, 0],
  [165, -10],
  [330, 8],
  [540, -8],
  [700, 10],
  [720, 0],
  [900, 0],
];

const PAN_Y_KEYS: [number, number][] = [
  [0, 0],
  [165, 6],
  [330, -6],
  [540, 6],
  [720, 0],
  [900, -4],
];

const keyed = (frame: number, keys: [number, number][]) => {
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0] = keys[i];
    const [f1, v1] = keys[i + 1];
    if (frame <= f1) {
      return interpolate(frame, [f0, f1], [v0, v1], {
        easing: EASE.inOut,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  }
  return keys[keys.length - 1][1];
};

export const cameraAt = (frame: number): Camera => {
  const t = frame / 30;
  return {
    x: keyed(frame, PAN_X_KEYS) + noise2D('cam-x', t * 0.35, 0) * 5,
    y: keyed(frame, PAN_Y_KEYS) + noise2D('cam-y', 0, t * 0.35) * 3.5,
    zoom: keyed(frame, ZOOM_KEYS),
    rotate: noise2D('cam-r', t * 0.25, t * 0.1) * 0.12,
  };
};

// Transform for a layer at a given depth (0 = infinitely far, 1 = subject plane, >1 = closer).
export const parallax = (cam: Camera, depth: number): React.CSSProperties => ({
  transform: `translate(${-cam.x * depth}px, ${-cam.y * depth}px) scale(${1 + (cam.zoom - 1) * depth}) rotate(${cam.rotate * depth}deg)`,
  transformOrigin: `${WIDTH / 2}px ${HEIGHT / 2}px`,
});
