// Procedural sound design for the MK Webcraft launch film.
// Every effect is synthesised from scratch (no samples) and written to public/sfx/*.wav.
// Run: npm run sfx

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SR = 48000;
const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sfx');
const TAU = Math.PI * 2;

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buffer = (seconds) => [new Float32Array(Math.ceil(seconds * SR)), new Float32Array(Math.ceil(seconds * SR))];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (t) => t * t * (3 - 2 * t);
const midi = (n) => 440 * 2 ** ((n - 69) / 12);

class Biquad {
  constructor() {
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
    this.set('lp', 1000, 0.707);
  }
  set(type, freq, q) {
    const f = clamp(freq, 10, SR * 0.45);
    const w0 = (TAU * f) / SR;
    const cos = Math.cos(w0);
    const alpha = Math.sin(w0) / (2 * q);
    let b0, b1, b2;
    if (type === 'lp') [b0, b1, b2] = [(1 - cos) / 2, 1 - cos, (1 - cos) / 2];
    else if (type === 'hp') [b0, b1, b2] = [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2];
    else [b0, b1, b2] = [alpha, 0, -alpha];
    const a0 = 1 + alpha;
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = (-2 * cos) / a0;
    this.a2 = (1 - alpha) / a0;
    return this;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

// Filtered noise with a time-varying cutoff. `freqAt(t)` and `ampAt(t)` take t in [0,1].
function noiseSweep(out, { start = 0, dur, type = 'bp', freqAt, q = 0.9, ampAt, panAt = () => 0, seed = 1, gain = 1 }) {
  const rand = mulberry32(seed);
  const f1 = new Biquad();
  const f2 = new Biquad();
  const n = Math.floor(dur * SR);
  const s0 = Math.floor(start * SR);
  let pink = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    if (i % 16 === 0) {
      const f = freqAt(t);
      f1.set(type, f, q);
      f2.set(type, f, q);
    }
    pink = 0.97 * pink + 0.03 * (rand() * 2 - 1) * 6;
    const white = rand() * 2 - 1;
    const src = 0.55 * white + 0.45 * pink;
    const y = f2.run(f1.run(src)) * ampAt(t) * gain;
    const p = clamp(panAt(t), -1, 1);
    const idx = s0 + i;
    if (idx >= out[0].length) break;
    out[0][idx] += y * Math.cos(((p + 1) * Math.PI) / 4);
    out[1][idx] += y * Math.sin(((p + 1) * Math.PI) / 4);
  }
}

// Sine voice with pitch glide, exponential or custom envelope and optional pan.
function tone(out, { start = 0, dur, freq, freqEnd = freq, glide = 0.05, attack = 0.004, decay = 0.3, amp = 0.5, pan = 0, partials = [[1, 1]], env }) {
  const n = Math.floor(dur * SR);
  const s0 = Math.floor(start * SR);
  const phases = partials.map(() => 0);
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const g = glide > 0 ? 1 - Math.exp(-tt / glide) : 1;
    const f = freq + (freqEnd - freq) * g;
    const e = env ? env(i / n, tt) : Math.min(1, tt / attack) * Math.exp(-Math.max(0, tt - attack) / decay);
    let s = 0;
    partials.forEach(([mult, a, pd], k) => {
      phases[k] += (TAU * f * mult) / SR;
      const pe = pd ? Math.exp(-tt / pd) : 1;
      s += Math.sin(phases[k]) * a * pe;
    });
    const y = s * e * amp;
    const idx = s0 + i;
    if (idx >= out[0].length) break;
    out[0][idx] += y * Math.cos(((pan + 1) * Math.PI) / 4);
    out[1][idx] += y * Math.sin(((pan + 1) * Math.PI) / 4);
  }
}

// Short filtered-noise transient (clicks, key taps, thumps).
function burst(out, { start = 0, dur = 0.01, freq = 3000, q = 1.2, type = 'bp', decay = 0.003, amp = 0.5, pan = 0, seed = 7 }) {
  const rand = mulberry32(seed);
  const f = new Biquad().set(type, freq, q);
  const n = Math.floor(dur * SR);
  const s0 = Math.floor(start * SR);
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const y = f.run(rand() * 2 - 1) * Math.exp(-tt / decay) * amp;
    const idx = s0 + i;
    if (idx >= out[0].length) break;
    out[0][idx] += y * Math.cos(((pan + 1) * Math.PI) / 4);
    out[1][idx] += y * Math.sin(((pan + 1) * Math.PI) / 4);
  }
}

// Freeverb-style stereo reverb, mixed in place.
function reverb(out, { wet = 0.25, room = 0.82, damp = 0.35, preDelay = 0.012 } = {}) {
  const scale = SR / 44100;
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((v) => Math.round(v * scale));
  const apT = [556, 441, 341, 225].map((v) => Math.round(v * scale));
  const spread = Math.round(23 * scale);
  const fb = room * 0.28 + 0.7;
  const pd = Math.round(preDelay * SR);
  const len = out[0].length;
  for (let ch = 0; ch < 2; ch++) {
    const input = out[ch].slice();
    const combs = combT.map((t) => ({ buf: new Float32Array(t + ch * spread), i: 0, store: 0 }));
    const aps = apT.map((t) => ({ buf: new Float32Array(t + ch * spread), i: 0 }));
    for (let n = 0; n < len; n++) {
      const x = (n - pd >= 0 ? input[n - pd] : 0) * 0.015;
      let acc = 0;
      for (const c of combs) {
        const y = c.buf[c.i];
        c.store = y * (1 - damp) + c.store * damp;
        c.buf[c.i] = x + c.store * fb;
        c.i = (c.i + 1) % c.buf.length;
        acc += y;
      }
      for (const a of aps) {
        const b = a.buf[a.i];
        a.buf[a.i] = acc + b * 0.5;
        a.i = (a.i + 1) % a.buf.length;
        acc = b - acc;
      }
      out[ch][n] = input[n] * (1 - wet * 0.5) + acc * wet * 3;
    }
  }
}

function lowpass(out, freq) {
  for (let ch = 0; ch < 2; ch++) {
    const f1 = new Biquad().set('lp', freq, 0.707);
    for (let i = 0; i < out[ch].length; i++) out[ch][i] = f1.run(out[ch][i]);
  }
}

function highpass(out, freq) {
  for (let ch = 0; ch < 2; ch++) {
    const f1 = new Biquad().set('hp', freq, 0.707);
    for (let i = 0; i < out[ch].length; i++) out[ch][i] = f1.run(out[ch][i]);
  }
}

function fadeTail(out, seconds = 0.08) {
  const n = Math.floor(seconds * SR);
  const len = out[0].length;
  for (let i = 0; i < n; i++) {
    const g = smooth(i / n);
    out[0][len - 1 - i] *= g;
    out[1][len - 1 - i] *= g;
  }
}

function write(name, out, peakDb = -1) {
  fadeTail(out);
  let peak = 0;
  for (const ch of out) for (const v of ch) peak = Math.max(peak, Math.abs(v));
  const target = 10 ** (peakDb / 20);
  const g = peak > 0 ? target / peak : 1;
  const len = out[0].length;
  const data = Buffer.alloc(44 + len * 4);
  data.write('RIFF', 0);
  data.writeUInt32LE(36 + len * 4, 4);
  data.write('WAVE', 8);
  data.write('fmt ', 12);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(2, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 4, 28);
  data.writeUInt16LE(4, 32);
  data.writeUInt16LE(16, 34);
  data.write('data', 36);
  data.writeUInt32LE(len * 4, 40);
  for (let i = 0; i < len; i++) {
    data.writeInt16LE(Math.round(clamp(out[0][i] * g, -1, 1) * 32767), 44 + i * 4);
    data.writeInt16LE(Math.round(clamp(out[1][i] * g, -1, 1) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(path.join(OUT_DIR, `${name}.wav`), data);
  console.log(`${name}.wav  ${(len / SR).toFixed(2)}s`);
}

const sounds = {
  // Soft UI tick: the caret, grid lines and small UI elements.
  tick() {
    const o = buffer(0.5);
    tone(o, { dur: 0.12, freq: 2350, decay: 0.018, amp: 0.5 });
    burst(o, { dur: 0.02, freq: 5200, decay: 0.0025, amp: 0.35, seed: 3 });
    lowpass(o, 7500);
    reverb(o, { wet: 0.22 });
    return o;
  },
  'tick-high'() {
    const o = buffer(0.5);
    tone(o, { dur: 0.1, freq: 3520, decay: 0.012, amp: 0.45 });
    tone(o, { start: 0.035, dur: 0.1, freq: 4186, decay: 0.012, amp: 0.25 });
    burst(o, { dur: 0.015, freq: 7000, decay: 0.002, amp: 0.3, seed: 11 });
    lowpass(o, 9000);
    reverb(o, { wet: 0.25 });
    return o;
  },
  // Airy whoosh that blooms and fades, panned left to right.
  whoosh() {
    const o = buffer(1.0);
    noiseSweep(o, {
      dur: 0.8,
      freqAt: (t) => 380 + 2100 * Math.sin(Math.PI * t) ** 1.4,
      q: 0.75,
      ampAt: (t) => smooth(Math.min(1, t / 0.45)) * (1 - smooth(Math.max(0, (t - 0.45) / 0.55))),
      panAt: (t) => -0.6 + 1.2 * t,
      seed: 21,
    });
    reverb(o, { wet: 0.25 });
    return o;
  },
  // Glassy whoosh for the search bar morphing into a browser window.
  'whoosh-glass'() {
    const o = buffer(1.6);
    noiseSweep(o, {
      dur: 0.9,
      freqAt: (t) => 500 + 2600 * smooth(t) - 1200 * smooth(Math.max(0, t - 0.6) / 0.4),
      q: 0.8,
      ampAt: (t) => smooth(Math.min(1, t / 0.5)) * (1 - smooth(Math.max(0, (t - 0.5) / 0.5))),
      panAt: (t) => -0.3 + 0.6 * t,
      seed: 5,
      gain: 0.9,
    });
    [1567.98, 2349.32, 3135.96].forEach((f, k) =>
      tone(o, { start: 0.28 + k * 0.05, dur: 1.1, freq: f, attack: 0.08, decay: 0.35, amp: 0.05, pan: k - 1 }),
    );
    reverb(o, { wet: 0.35 });
    return o;
  },
  'whoosh-out'() {
    const o = buffer(0.9);
    noiseSweep(o, {
      dur: 0.6,
      freqAt: (t) => 2400 - 1900 * smooth(t),
      q: 0.8,
      ampAt: (t) => smooth(Math.min(1, t / 0.12)) * (1 - smooth(t)),
      panAt: (t) => 0.2 - 0.4 * t,
      seed: 33,
    });
    reverb(o, { wet: 0.25 });
    return o;
  },
  // Gentle key taps for typing (search query, code panel).
  typing() {
    const o = buffer(1.3);
    const rand = mulberry32(99);
    let t = 0.01;
    let k = 0;
    while (t < 1.0) {
      const a = 0.25 + rand() * 0.2;
      burst(o, { start: t, dur: 0.02, freq: 1800 + rand() * 1600, q: 1.4, decay: 0.0035, amp: a, pan: (rand() - 0.5) * 0.4, seed: 100 + k });
      tone(o, { start: t, dur: 0.03, freq: 190 + rand() * 40, decay: 0.008, amp: a * 0.35 });
      t += 0.028 + rand() * 0.03;
      k++;
    }
    lowpass(o, 6000);
    reverb(o, { wet: 0.18 });
    return o;
  },
  // Enter / press.
  click() {
    const o = buffer(0.6);
    burst(o, { dur: 0.01, freq: 4200, q: 0.9, decay: 0.0018, amp: 0.6, seed: 4 });
    tone(o, { dur: 0.12, freq: 1320, freqEnd: 1180, glide: 0.02, decay: 0.03, amp: 0.4 });
    tone(o, { dur: 0.1, freq: 140, decay: 0.03, amp: 0.35 });
    lowpass(o, 8000);
    reverb(o, { wet: 0.22 });
    return o;
  },
  'click-bright'() {
    const o = buffer(1.2);
    burst(o, { dur: 0.01, freq: 5000, q: 0.9, decay: 0.0015, amp: 0.5, seed: 8 });
    tone(o, { dur: 0.9, freq: 2093, decay: 0.28, amp: 0.22, partials: [[1, 1], [2.01, 0.25, 0.08]] });
    tone(o, { start: 0.07, dur: 0.9, freq: 3136, decay: 0.25, amp: 0.13 });
    reverb(o, { wet: 0.35 });
    return o;
  },
  // Soft "landing" thud.
  land() {
    const o = buffer(0.8);
    tone(o, { dur: 0.4, freq: 110, freqEnd: 58, glide: 0.06, decay: 0.12, amp: 0.7 });
    noiseSweep(o, { dur: 0.18, type: 'lp', freqAt: () => 420, q: 0.7, ampAt: (t) => (1 - t) ** 3, seed: 61, gain: 0.8 });
    reverb(o, { wet: 0.2 });
    return o;
  },
  // Title swells: soft noise bloom + chord pad.
  swell() {
    const o = buffer(2.2);
    noiseSweep(o, { dur: 1.2, type: 'lp', freqAt: (t) => 300 + 2600 * smooth(t), q: 0.6, ampAt: (t) => Math.sin(Math.PI * t) ** 2 * 0.45, seed: 13 });
    [57, 64, 69, 73, 76].forEach((n, k) =>
      tone(o, { start: 0.02 * k, dur: 2.0, freq: midi(n), env: (u, tt) => smooth(Math.min(1, tt / 0.35)) * Math.exp(-Math.max(0, tt - 0.35) / 0.55), amp: 0.09, pan: (k - 2) * 0.25, partials: [[1, 1], [2, 0.12]] }),
    );
    lowpass(o, 5000);
    reverb(o, { wet: 0.4 });
    return o;
  },
  'swell-low'() {
    const o = buffer(2.2);
    noiseSweep(o, { dur: 1.0, type: 'lp', freqAt: (t) => 200 + 900 * smooth(t), q: 0.6, ampAt: (t) => Math.sin(Math.PI * t) ** 2 * 0.5, seed: 17 });
    [45, 52, 57, 60, 64].forEach((n, k) =>
      tone(o, { start: 0.015 * k, dur: 2.0, freq: midi(n), env: (u, tt) => smooth(Math.min(1, tt / 0.3)) * Math.exp(-Math.max(0, tt - 0.3) / 0.5), amp: 0.1, pan: (k - 2) * 0.2, partials: [[1, 1], [2, 0.1]] }),
    );
    lowpass(o, 3200);
    reverb(o, { wet: 0.4 });
    return o;
  },
  'swell-bright'() {
    const o = buffer(2.4);
    noiseSweep(o, { dur: 1.1, type: 'lp', freqAt: (t) => 500 + 4200 * smooth(t), q: 0.6, ampAt: (t) => Math.sin(Math.PI * t) ** 2 * 0.4, seed: 19 });
    [64, 68, 71, 76, 78, 83].forEach((n, k) =>
      tone(o, { start: 0.025 * k, dur: 2.2, freq: midi(n), env: (u, tt) => smooth(Math.min(1, tt / 0.3)) * Math.exp(-Math.max(0, tt - 0.3) / 0.6), amp: 0.08, pan: (k - 2.5) * 0.22, partials: [[1, 1], [2, 0.1]] }),
    );
    lowpass(o, 7000);
    reverb(o, { wet: 0.42 });
    return o;
  },
  // Digital stutter when the outdated site glitches.
  glitch() {
    const o = buffer(0.7);
    for (let k = 0; k < 5; k++) {
      burst(o, { start: k * 0.034, dur: 0.022, freq: 1400 + k * 260, q: 3, decay: 0.012, amp: 0.45 * (1 - k * 0.15), pan: k % 2 ? 0.3 : -0.3, seed: 200 + k });
      tone(o, { start: k * 0.034, dur: 0.02, freq: 310 + (k % 2) * 330, decay: 0.01, amp: 0.15 });
    }
    lowpass(o, 6000);
    reverb(o, { wet: 0.2 });
    return o;
  },
  // Neon scan beam sweeping left to right.
  beam() {
    const o = buffer(1.8);
    noiseSweep(o, {
      dur: 1.2,
      freqAt: (t) => 500 + 5200 * smooth(t),
      q: 1.1,
      ampAt: (t) => smooth(Math.min(1, t / 0.6)) * (1 - smooth(Math.max(0, (t - 0.7) / 0.3))),
      panAt: (t) => -0.85 + 1.7 * t,
      seed: 41,
    });
    tone(o, { dur: 1.2, freq: 392, freqEnd: 1568, glide: 0.5, env: (u) => Math.sin(Math.PI * u) ** 2, amp: 0.08, partials: [[1, 1], [1.5, 0.3]] });
    reverb(o, { wet: 0.35 });
    return o;
  },
  pop() {
    const o = buffer(0.6);
    tone(o, { dur: 0.25, freq: 720, freqEnd: 360, glide: 0.025, decay: 0.06, amp: 0.6, partials: [[1, 1], [2, 0.12, 0.02]] });
    burst(o, { dur: 0.008, freq: 3200, q: 0.8, decay: 0.0015, amp: 0.25, seed: 51 });
    lowpass(o, 6000);
    reverb(o, { wet: 0.25 });
    return o;
  },
  shimmer() {
    const o = buffer(1.8);
    const rand = mulberry32(77);
    for (let k = 0; k < 14; k++) {
      const f = 2400 + rand() * 4800;
      tone(o, { start: rand() * 0.25, dur: 1.2, freq: f, env: (u, tt) => smooth(Math.min(1, tt / 0.12)) * Math.exp(-tt / 0.32) * (0.6 + 0.4 * Math.sin(tt * (18 + k * 3))), amp: 0.035, pan: rand() * 1.6 - 0.8 });
    }
    highpass(o, 1500);
    lowpass(o, 9000);
    reverb(o, { wet: 0.45 });
    return o;
  },
  // Diamond chime.
  chime() {
    const o = buffer(2.2);
    tone(o, { dur: 1.8, freq: 1567.98, attack: 0.002, decay: 0.55, amp: 0.3, partials: [[1, 1], [2.0, 0.35, 0.3], [2.76, 0.25, 0.2], [4.07, 0.12, 0.12], [5.4, 0.08, 0.08]] });
    tone(o, { start: 0.09, dur: 1.6, freq: 2349.32, attack: 0.002, decay: 0.45, amp: 0.14, pan: 0.3, partials: [[1, 1], [2.76, 0.2, 0.15]] });
    reverb(o, { wet: 0.45 });
    return o;
  },
  swipe() {
    const o = buffer(0.7);
    noiseSweep(o, { dur: 0.35, freqAt: (t) => 1400 + 3200 * t, q: 1.0, ampAt: (t) => Math.sin(Math.PI * t) ** 1.5, panAt: (t) => 0.6 - 1.2 * t, seed: 71 });
    reverb(o, { wet: 0.25 });
    return o;
  },
  // Count-up roll that ends on a soft ding.
  counter() {
    const o = buffer(1.5);
    const n = 11;
    for (let k = 0; k < n; k++) {
      const t = 0.75 * smooth(k / (n - 1)) ** 0.8;
      tone(o, { start: t, dur: 0.05, freq: 2800 + k * 60, decay: 0.008, amp: 0.22 });
    }
    tone(o, { start: 0.8, dur: 0.7, freq: 1975.53, decay: 0.22, amp: 0.25, partials: [[1, 1], [2, 0.2, 0.05]] });
    reverb(o, { wet: 0.3 });
    return o;
  },
  // Pre-logo riser that cuts to silence.
  riser() {
    const o = buffer(1.05);
    noiseSweep(o, { dur: 1.0, freqAt: (t) => 220 + 5200 * t ** 2, q: 1.0, ampAt: (t) => t ** 2.2, seed: 91, gain: 0.9 });
    tone(o, { dur: 1.0, freq: 110, freqEnd: 440, glide: 0.45, env: (u) => u ** 2 * (0.75 + 0.25 * Math.sin(u * u * 80)), amp: 0.12, partials: [[1, 1], [2, 0.3], [3, 0.12]] });
    reverb(o, { wet: 0.2 });
    return o;
  },
  // Logo reveal: soft sub hit, warm glass chord and long airy tail.
  impact() {
    const o = buffer(5.5);
    tone(o, { dur: 2.6, freq: 82, freqEnd: 44, glide: 0.25, attack: 0.006, decay: 0.75, amp: 0.85 });
    noiseSweep(o, { dur: 0.35, type: 'lp', freqAt: (t) => 900 - 700 * t, q: 0.7, ampAt: (t) => (1 - t) ** 4, seed: 123, gain: 0.7 });
    [52, 59, 64, 66, 68, 71, 76].forEach((n, k) =>
      tone(o, { start: 0.012 * k, dur: 4.8, freq: midi(n), attack: 0.02, decay: 1.25 + k * 0.12, amp: 0.085, pan: (k - 3) * 0.2, partials: [[1, 1], [2, 0.2, 0.6], [3, 0.06, 0.3]] }),
    );
    noiseSweep(o, { start: 0.05, dur: 2.5, freqAt: (t) => 3200 + 2000 * t, q: 0.7, ampAt: (t) => (1 - t) ** 2 * 0.12, panAt: (t) => Math.sin(t * 6) * 0.5, seed: 124 });
    reverb(o, { wet: 0.5, room: 0.9 });
    return o;
  },
  // Light sweep across the logo, panned with the highlight.
  sparkle() {
    const o = buffer(1.6);
    const rand = mulberry32(55);
    for (let k = 0; k < 18; k++) {
      const st = (k / 18) * 0.5 + rand() * 0.04;
      tone(o, { start: st, dur: 0.6, freq: 3200 + rand() * 4500, attack: 0.004, decay: 0.12 + rand() * 0.1, amp: 0.05, pan: -0.8 + 1.6 * (k / 17) });
    }
    noiseSweep(o, { dur: 0.6, freqAt: (t) => 4000 + 3000 * t, q: 1.2, ampAt: (t) => Math.sin(Math.PI * t) * 0.2, panAt: (t) => -0.8 + 1.6 * t, seed: 56 });
    highpass(o, 1800);
    reverb(o, { wet: 0.45 });
    return o;
  },
  // Warm, soft tone under the tagline.
  tone() {
    const o = buffer(2.6);
    [64, 71, 76].forEach((n, k) =>
      tone(o, { start: k * 0.03, dur: 2.4, freq: midi(n), env: (u, tt) => smooth(Math.min(1, tt / 0.25)) * Math.exp(-Math.max(0, tt - 0.25) / 0.7), amp: 0.12, pan: (k - 1) * 0.3, partials: [[1, 1], [2, 0.15], [3, 0.04]] }),
    );
    lowpass(o, 4500);
    reverb(o, { wet: 0.45 });
    return o;
  },
};

// Muted descending knocks for each problem tag.
[64, 62, 60, 59, 57].forEach((n, k) => {
  sounds[`thock-${k + 1}`] = () => {
    const o = buffer(0.8);
    const f = midi(n - 12);
    tone(o, { dur: 0.45, freq: f * 1.5, freqEnd: f, glide: 0.03, decay: 0.09, amp: 0.65, partials: [[1, 1], [2, 0.18, 0.03]] });
    tone(o, { dur: 0.3, freq: f * 1.06, decay: 0.07, amp: 0.12 });
    noiseSweep(o, { dur: 0.06, type: 'lp', freqAt: () => 900, q: 0.7, ampAt: (t) => (1 - t) ** 3, seed: 300 + k, gain: 0.6 });
    lowpass(o, 3000);
    reverb(o, { wet: 0.22 });
    return o;
  };
});

// Ascending pentatonic plucks for the service chips (panned to their side of frame).
[76, 78, 80, 83, 85, 88, 90, 92].forEach((n, k) => {
  sounds[`note-${k + 1}`] = () => {
    const o = buffer(1.4);
    const pan = k % 2 === 0 ? -0.45 : 0.45;
    tone(o, { dur: 1.2, freq: midi(n), attack: 0.002, decay: 0.32, amp: 0.4, pan, partials: [[1, 1], [4, 0.18, 0.03], [10, 0.05, 0.006]] });
    burst(o, { dur: 0.006, freq: 6000, q: 1, decay: 0.001, amp: 0.12, pan, seed: 400 + k });
    reverb(o, { wet: 0.32 });
    return o;
  };
});

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const [name, make] of Object.entries(sounds)) write(name, make());
