// Brand tokens taken from mkwebcraft.in (globals.css + brand kit section).
export const COLORS = {
  cod: '#0c0c0c',
  ink: '#0b0b0c',
  neon: '#e6fa14',
  white: '#ffffff',
  mercury: '#e4e4e4',
  alto: '#d6d6d6',
  // Sampled from the official logo artwork.
  logoYellow: '#f4fd2a',
  logoLime: '#9fdc3c',
  logoTeal: '#0e8f89',
  // Only used to flag problems on the outdated website.
  issue: '#ff6a5c',
  // Viscont Jewellery (client work by MK Webcraft).
  gold: '#d9b45e',
  goldLight: '#f6e3a8',
  goldDeep: '#a77b2e',
  ivory: '#efe6d2',
};

export const neon = (alpha: number) => `rgba(230, 250, 20, ${alpha})`;
export const white = (alpha: number) => `rgba(255, 255, 255, ${alpha})`;
export const teal = (alpha: number) => `rgba(14, 143, 137, ${alpha})`;

export const FONTS = {
  display: '"Inter", "Inter Fallback", system-ui, sans-serif',
  condensed: '"Bebas Neue", "Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
  luxe: '"Montserrat", "Inter", sans-serif',
  legacy: '"Tinos", "Times New Roman", serif',
};

export const WIDTH = 1920;
export const HEIGHT = 1080;
