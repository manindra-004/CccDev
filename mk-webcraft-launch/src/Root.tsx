import React from 'react';
import { Composition } from 'remotion';
import { MKWebcraftLaunch } from './MKWebcraftLaunch';
import { HEIGHT, WIDTH } from './theme';
import { DURATION_IN_FRAMES, FPS } from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition id="MKWebcraftLaunch" component={MKWebcraftLaunch} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
