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
  caretIn: 4,
  pillOpen: 12,
  typeStart: 22,
  typeFramesPerChar: 1,
  title1: 58,
  enter: 130,
  title1Out: 133,
  morph: 144,

  // Scene 2 - Most websites fall short.
  windowLand: 162,
  siteChunks: [152, 162, 173],
  title2: 186,
  issues: [beat(14), beat(15), beat(16), beat(17), beat(18)],
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
  codePanel: 412,
  codeTyping: 418,
  codeTypingFrames: 24,
  panelsOut: 450,
  chips: [458, 465, 473, 480, 488, 495, 503, 510],
  secure: 520,

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
  collapse: 684,
  collapseFrames: 22,
  title4Out: 678,

  // Scene 5 - Logo reveal: the outline draws out of the point of light during the riser, then the hit fills it.
  logoDraw: 703,
  logoHit: 720,
  logoFill: 720,
  logoSweep: 744,
  lockup: 768,
  wordmarkIn: 774,
  taglineIn: 792,
  urlIn: 816,
} as const;

export const TYPE_END = CUES.typeStart + SEARCH_QUERY.length * CUES.typeFramesPerChar;

type SfxCue = { frame: number; file: string; volume: number };

// Whooshes swell for ~11 frames before peaking; starting them early lands the peak on the fastest part of each move.
const WHOOSH_LEAD = 5;

// Volumes are tiered so the hero moments (window morph, rebuild beam, logo hit) carry the most
// weight and small UI elements stay a whisper.
export const SFX: SfxCue[] = [
  { frame: 0, file: 'air', volume: 0.012 },

  // Scene 1
  { frame: CUES.caretIn, file: 'tick', volume: 0.2 },
  { frame: CUES.pillOpen - WHOOSH_LEAD, file: 'whoosh', volume: 0.3 },
  { frame: CUES.typeStart, file: 'typing', volume: 0.15 },
  { frame: CUES.title1, file: 'swell', volume: 0.24 },
  { frame: CUES.enter, file: 'click', volume: 0.28 },
  { frame: CUES.morph - WHOOSH_LEAD, file: 'whoosh-glass', volume: 0.42 },

  // Scene 2
  { frame: CUES.windowLand, file: 'land', volume: 0.3 },
  { frame: CUES.title2, file: 'swell-low', volume: 0.24 },
  ...CUES.issues.map((frame, i) => ({ frame, file: `thock-${i + 1}`, volume: 0.27 })),
  { frame: CUES.glitch, file: 'glitch', volume: 0.16 },
  { frame: CUES.beam, file: 'beam', volume: 0.42 },

  // Scene 3
  { frame: CUES.title3, file: 'swell-bright', volume: 0.22 },
  { frame: CUES.wireframe, file: 'tick', volume: 0.15 },
  { frame: CUES.brandPanel, file: 'pop', volume: 0.2 },
  { frame: CUES.nav, file: 'tick-high', volume: 0.13 },
  { frame: CUES.wordmark, file: 'shimmer', volume: 0.2 },
  { frame: CUES.diamond, file: 'chime', volume: 0.22 },
  { frame: CUES.marquee, file: 'swipe', volume: 0.15 },
  { frame: CUES.codePanel, file: 'pop', volume: 0.18 },
  { frame: CUES.codeTyping, file: 'typing', volume: 0.11 },
  { frame: CUES.panelsOut - 2, file: 'whoosh-out', volume: 0.2 },
  ...CUES.chips.map((frame, i) => ({ frame, file: `note-${i + 1}`, volume: 0.19 })),
  { frame: CUES.secure, file: 'click-bright', volume: 0.25 },

  // Scene 4
  { frame: CUES.toDevices - WHOOSH_LEAD, file: 'whoosh', volume: 0.3 },
  { frame: CUES.tablet, file: 'pop', volume: 0.2 },
  { frame: CUES.phone, file: 'pop', volume: 0.2 },
  { frame: CUES.title4, file: 'swell', volume: 0.24 },
  { frame: CUES.stat1, file: 'counter', volume: 0.19 },
  { frame: CUES.stat2, file: 'counter', volume: 0.17 },
  { frame: CUES.riser, file: 'riser', volume: 0.34 },

  // Scene 5
  { frame: CUES.logoHit, file: 'impact', volume: 0.75 },
  { frame: CUES.logoSweep, file: 'sparkle', volume: 0.24 },
  { frame: CUES.wordmarkIn, file: 'whoosh', volume: 0.2 },
  { frame: CUES.taglineIn, file: 'tone', volume: 0.22 },
  { frame: CUES.urlIn, file: 'click', volume: 0.26 },
];
