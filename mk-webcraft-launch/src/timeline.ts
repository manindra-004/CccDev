// Every visual cue and every sound effect is keyed off this file, so motion and
// audio stay frame-locked. Edit a cue here and both picture and sound follow.

export const FPS = 30;
export const BPM = 120;
export const FRAMES_PER_BEAT = (60 / BPM) * FPS;
export const DURATION_IN_FRAMES = 900;

export const beat = (n: number) => Math.round(n * FRAMES_PER_BEAT);

export const SCENES = {
  online: { from: 0, to: 165 },
  problem: { from: 165, to: 330 },
  craft: { from: 330, to: 540 },
  results: { from: 540, to: 720 },
  brand: { from: 720, to: DURATION_IN_FRAMES },
} as const;

export const SEARCH_QUERY = 'best jewellery store near me';

export const CUES = {
  // Scene 1 - First impressions happen online.
  caretIn: 8,
  pillOpen: 15,
  typeStart: 26,
  typeFramesPerChar: 1,
  title1: 58,
  enter: 130,
  title1Out: 133,
  morph: 140,

  // Scene 2 - Most websites fall short.
  windowLand: 168,
  siteChunks: [166, 173, 181],
  title2: 186,
  issues: [218, 233, 248, 263, 278],
  glitch: 289,
  beam: 300,
  beamEnd: 336,
  title2Out: 300,

  // Scene 3 - Crafted to convert.
  grid: 314,
  title3: 334,
  wireframe: 348,
  brandPanel: 364,
  nav: 380,
  wordmark: 388,
  diamond: 396,
  tagline: 404,
  marquee: 410,
  codePanel: 418,
  codeTyping: 424,
  panelsOut: 462,
  chips: [470, 477, 485, 492, 500, 507, 515, 522],
  secure: 528,

  // Scene 4 - From ordinary to extraordinary.
  toDevices: 540,
  title3Out: 540,
  tablet: 556,
  phone: 566,
  title4: 574,
  wall: 580,
  stat1: 610,
  stat2: 626,
  riser: 684,
  collapse: 688,
  title4Out: 680,

  // Scene 5 - Logo reveal.
  logoHit: 720,
  logoFill: 736,
  logoSweep: 760,
  lockup: 780,
  wordmarkIn: 786,
  taglineIn: 804,
  urlIn: 830,
} as const;

export const TYPE_END = CUES.typeStart + SEARCH_QUERY.length * CUES.typeFramesPerChar;

type SfxCue = { frame: number; file: string; volume: number };

export const SFX: SfxCue[] = [
  // Scene 1
  { frame: CUES.caretIn, file: 'tick', volume: 0.32 },
  { frame: CUES.pillOpen, file: 'whoosh', volume: 0.42 },
  { frame: CUES.typeStart, file: 'typing', volume: 0.26 },
  { frame: CUES.title1, file: 'swell', volume: 0.36 },
  { frame: CUES.enter, file: 'click', volume: 0.38 },
  { frame: CUES.morph, file: 'whoosh-glass', volume: 0.44 },

  // Scene 2
  { frame: CUES.windowLand, file: 'land', volume: 0.4 },
  { frame: CUES.title2, file: 'swell-low', volume: 0.34 },
  ...CUES.issues.map((frame, i) => ({ frame, file: `thock-${i + 1}`, volume: 0.34 })),
  { frame: CUES.glitch, file: 'glitch', volume: 0.22 },
  { frame: CUES.beam, file: 'beam', volume: 0.42 },

  // Scene 3
  { frame: CUES.grid, file: 'tick-high', volume: 0.2 },
  { frame: CUES.title3, file: 'swell-bright', volume: 0.34 },
  { frame: CUES.wireframe, file: 'tick', volume: 0.22 },
  { frame: CUES.brandPanel, file: 'pop', volume: 0.3 },
  { frame: CUES.nav, file: 'tick-high', volume: 0.2 },
  { frame: CUES.wordmark, file: 'shimmer', volume: 0.32 },
  { frame: CUES.diamond, file: 'chime', volume: 0.3 },
  { frame: CUES.marquee, file: 'swipe', volume: 0.26 },
  { frame: CUES.codePanel, file: 'pop', volume: 0.26 },
  { frame: CUES.codeTyping, file: 'typing', volume: 0.18 },
  { frame: CUES.panelsOut, file: 'whoosh-out', volume: 0.3 },
  ...CUES.chips.map((frame, i) => ({ frame, file: `note-${i + 1}`, volume: 0.24 })),
  { frame: CUES.secure, file: 'click-bright', volume: 0.3 },

  // Scene 4
  { frame: CUES.toDevices, file: 'whoosh', volume: 0.38 },
  { frame: CUES.tablet, file: 'pop', volume: 0.28 },
  { frame: CUES.phone, file: 'pop', volume: 0.28 },
  { frame: CUES.title4, file: 'swell', volume: 0.34 },
  { frame: CUES.title4 + 20, file: 'shimmer', volume: 0.24 },
  { frame: CUES.stat1, file: 'counter', volume: 0.26 },
  { frame: CUES.stat2, file: 'counter', volume: 0.22 },
  { frame: CUES.riser, file: 'riser', volume: 0.36 },

  // Scene 5
  { frame: CUES.logoHit, file: 'impact', volume: 0.62 },
  { frame: CUES.logoFill, file: 'shimmer', volume: 0.26 },
  { frame: CUES.logoSweep, file: 'sparkle', volume: 0.3 },
  { frame: CUES.wordmarkIn, file: 'whoosh', volume: 0.26 },
  { frame: CUES.taglineIn, file: 'tone', volume: 0.26 },
  { frame: CUES.urlIn, file: 'click', volume: 0.3 },
];
