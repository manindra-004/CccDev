# MK Webcraft — 30s launch film (Remotion)

A 30-second, 1920×1080 / 30 fps launch film for [mkwebcraft.in](https://mkwebcraft.in), built entirely in code with [Remotion](https://www.remotion.dev). Every frame, transition and sound effect is generated from this project, so copy, timing, colours and audio can be edited and re-rendered.

## Story

One browser window carries the whole film:

| # | Time | Title | What happens |
|---|------|-------|--------------|
| 1 | 0.0–5.5s | **First impressions happen online.** | A neon caret blooms into a search bar; a customer searches for a jewellery store. |
| 2 | 5.5–11s | **Most websites fall short.** | The search bar opens into a dated website; callouts flag outdated design, weak branding, poor UX, slow loading and lost conversions. |
| 3 | 11–18s | **Crafted to convert.** | A neon beam wipes the old site into a blueprint. MK Webcraft's process (Discover → Design → Build → Launch) rebuilds it as the real [Viscont](https://www.viscont.in) storefront, with brand kit, Next.js code, services and a secure launch. |
| 4 | 18–24s | **From ordinary to extraordinary.** | The site lands on laptop, tablet and phone with Viscont's published results (+34% conversion rate, +19% customer retention). |
| 5 | 24–30s | Logo reveal | Everything collapses to a point of light; the MK mark draws on in neon, fills, catches a light sweep, and locks up with the wordmark, tagline and **mkwebcraft.in**. |

## Commands

```bash
npm install
npm run dev        # Remotion Studio (live preview + scrubbing)
npm run render     # -> out/mk-webcraft-launch.mp4
npm run inspect -- 120 450 885   # render QA stills to out/inspect/
```

`npm run sfx` (run automatically before `dev`, `render` and `still`) synthesises the sound effects into `public/sfx/`.

The master is H.264 High (CRF 16) in BT.709 / TV range, rendered from PNG frames so the brand neon decodes the same in every player, with 48 kHz stereo AAC (about −21 LUFS integrated, −3.5 dBFS peak). Settings live in `remotion.config.ts`.

## Editing

- **Timing and sound sync** — `src/timeline.ts` is the single source of truth. Every visual cue (`CUES`) and every sound effect (`SFX`) is a frame number on a 120 BPM grid (15 frames per beat). Move a cue and the matching sound moves with it.
- **Copy** — scene titles live in `src/scenes/Titles.tsx`; wrap a word in `*asterisks*` for the neon accent. The end-card tagline and URL are in `src/scenes/Scene5Brand.tsx`.
- **Brand tokens** — colours, fonts and easing curves come from the mkwebcraft.in stylesheet: `src/theme.ts` and `src/lib/motion.ts`.
- **Camera** — `src/lib/camera.ts` defines one continuous camera path (pushes, pans, handheld drift). Layers sample it at different depths for parallax.
- **Sound design** — `scripts/generate-sfx.mjs` synthesises every effect from scratch (filtered noise, sine voices, Freeverb-style reverb). There are no samples or external files.

## Assets

- `public/images/mk-logo.png` is the official logo from mkwebcraft.in. `scripts/trace_logo.py` traces it with potrace into `src/logo/mkLogoPaths.ts`: two letterform outlines, five luminance tone layers and a rim-highlight layer. These drive the vector draw-on, fill and light sweep; the final frame settles on the official PNG.
- `public/fonts/` holds Inter and Bebas Neue (the exact files served by mkwebcraft.in), Montserrat (Viscont wordmark), JetBrains Mono (code) and Tinos (the dated site).
- `public/images/project-*.jpg` are MK Webcraft case-study images from mkwebcraft.in/projects.

Re-tracing the logo requires Python 3 with `numpy`, `pillow`, `scipy` and the `potrace` CLI (`npm run logo`).
