import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// Inter and Bebas Neue are the exact font files served by mkwebcraft.in.
const fonts: Parameters<typeof loadFont>[0][] = [
  { family: 'Inter', url: staticFile('fonts/Inter-Variable-Latin.woff2'), weight: '100 900' },
  {
    family: 'Inter',
    url: staticFile('fonts/Inter-Variable-LatinExt.woff2'),
    weight: '100 900',
    unicodeRange: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
  },
  { family: 'Bebas Neue', url: staticFile('fonts/BebasNeue-Latin.woff2'), weight: '400' },
  { family: 'JetBrains Mono', url: staticFile('fonts/JetBrainsMono-Variable-Latin.woff2'), weight: '100 800' },
  { family: 'Montserrat', url: staticFile('fonts/Montserrat-Variable-Latin.woff2'), weight: '100 900' },
  { family: 'Tinos', url: staticFile('fonts/Tinos-400-Latin.woff2'), weight: '400' },
  { family: 'Tinos', url: staticFile('fonts/Tinos-700-Latin.woff2'), weight: '700' },
];

let loaded = false;

export const loadBrandFonts = () => {
  if (loaded) return;
  loaded = true;
  fonts.forEach((font) => {
    loadFont(font);
  });
};
