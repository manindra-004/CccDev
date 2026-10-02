import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SoundDesign } from './audio/SoundDesign';
import { Backdrop, FilmFinish } from './components/Backdrop';
import { HeroWindow } from './components/HeroWindow';
import { PortfolioWall } from './components/PortfolioWall';
import { loadBrandFonts } from './fonts';
import { cameraAt, parallax } from './lib/camera';
import { Scene2Problem } from './scenes/Scene2Problem';
import { Scene3Craft } from './scenes/Scene3Craft';
import { Scene4Devices, Scene4Overlay } from './scenes/Scene4Results';
import { Scene5Brand } from './scenes/Scene5Brand';
import { Titles } from './scenes/Titles';
import { CUES } from './timeline';
import { FONTS } from './theme';

loadBrandFonts();

// Depth of each layer relative to the camera; titles sit further back so they stay steady to read.
const DEPTH = { wall: 0.6, titles: 0.55, world: 1, front: 1.12, brand: 0.8 };

export const MKWebcraftLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);

  return (
    <AbsoluteFill style={{ fontFamily: FONTS.display, backgroundColor: '#0b0b0c' }}>
      <Backdrop />

      <AbsoluteFill style={parallax(cam, DEPTH.wall)}>
        <PortfolioWall start={CUES.wall} exitAt={CUES.collapse} />
      </AbsoluteFill>

      <AbsoluteFill style={parallax(cam, DEPTH.world)}>
        <HeroWindow />
        <Scene4Devices />
        <Scene2Problem />
      </AbsoluteFill>

      <AbsoluteFill style={parallax(cam, DEPTH.front)}>
        <Scene3Craft />
        <Scene4Overlay />
      </AbsoluteFill>

      <AbsoluteFill style={parallax(cam, DEPTH.titles)}>
        <Titles />
      </AbsoluteFill>

      <AbsoluteFill style={parallax(cam, DEPTH.brand)}>
        <Scene5Brand />
      </AbsoluteFill>

      <FilmFinish />
      <SoundDesign />
    </AbsoluteFill>
  );
};
