// Renders still frames for visual QA: node scripts/inspect-frames.mjs 0 60 120 ...
// Frames default to one every half second. Output: out/inspect/f0000.jpg
import fs from 'node:fs';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { openBrowser, renderStill, selectComposition } from '@remotion/renderer';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, 'out', 'inspect');
fs.mkdirSync(outDir, { recursive: true });

const args = process.argv.slice(2).map(Number).filter((n) => Number.isFinite(n));
const frames = args.length ? args : Array.from({ length: 60 }, (_, i) => i * 15);

const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
const browser = await openBrowser('chrome');
const composition = await selectComposition({ serveUrl, id: 'MKWebcraftLaunch', puppeteerInstance: browser });

for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(4, '0')}.jpg`);
  const t0 = Date.now();
  await renderStill({ serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 88, puppeteerInstance: browser, overwrite: true });
  console.log(`frame ${frame} -> ${path.relative(root, output)} (${Date.now() - t0}ms)`);
}
await browser.close({ silent: true });
