// Accent colour derivation from docs/design/meetvent-design (README §2, renderVals()).
// The brand accent is still being decided, so fill/text/soft/line shades are
// computed from it instead of being hardcoded.

type RGB = [number, number, number];

export type AccentPalette = {
  accent: string;
  accentFill: string;
  accentText: string;
  accentSoft: string;
  accentLine: string;
};

export const FILL_MIN_CONTRAST = 3.1;
export const TEXT_MIN_CONTRAST = 4.6;
const MAX_STEPS = 40;

export function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(rgb: RGB): string {
  return "#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function relativeLuminance(rgb: RGB): number {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastWithWhite(rgb: RGB): number {
  return 1.05 / (relativeLuminance(rgb) + 0.05);
}

function darkenUntil(rgb: RGB, factor: number, minContrast: number): RGB {
  let current = rgb;
  for (let i = 0; i < MAX_STEPS && contrastWithWhite(current) < minContrast; i++) {
    current = current.map((c) => c * factor) as RGB;
  }
  return current;
}

function mixWithWhite(rgb: RGB, amount: number): RGB {
  return rgb.map((c) => c + (255 - c) * amount) as RGB;
}

export function deriveAccent(accent: string): AccentPalette {
  const base = hexToRgb(accent);
  return {
    accent: rgbToHex(base),
    accentFill: rgbToHex(darkenUntil(base, 0.97, FILL_MIN_CONTRAST)),
    accentText: rgbToHex(darkenUntil(base, 0.96, TEXT_MIN_CONTRAST)),
    accentSoft: rgbToHex(mixWithWhite(base, 0.88)),
    accentLine: rgbToHex(mixWithWhite(base, 0.45)),
  };
}
