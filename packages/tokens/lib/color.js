/**
 * @file Color math for the tokens build: contrast-targeted OKLCH scales.
 *
 * Every scale step is solved to a fixed WCAG contrast ratio against white, so
 * a step does the same job for any hue (600 always passes AA with white text,
 * 800 always passes AAA). Hue comes from the input color; chroma follows the
 * input, tapers toward the ends of the scale, and is clamped to sRGB.
 */

import { converter, formatHex, toGamut, wcagContrast } from 'culori';

const toOklch = converter('oklch');
const intoSrgb = toGamut('rgb', 'oklch');

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** Target contrast against white for each step. See docs/tokens.md. */
export const CONTRAST_TARGETS = {
  50: 1.05,
  100: 1.12,
  200: 1.3,
  300: 1.6,
  400: 2.2,
  500: 3.2,
  600: 4.7,
  700: 6.2,
  800: 8.2,
  900: 12,
  950: 16,
};

/** Share of the input's chroma used at each step. */
const CHROMA_TAPER = {
  50: 0.25,
  100: 0.4,
  200: 0.6,
  300: 0.8,
  400: 0.95,
  500: 1,
  600: 1,
  700: 0.95,
  800: 0.85,
  900: 0.7,
  950: 0.55,
};

export const WHITE = '#ffffff';

export const contrast = (a, b) => wcagContrast(a, b);

/** OKLCH components for any CSS color string, with hue defaulting to 0. */
export function oklchOf(color) {
  const { l, c, h } = toOklch(color);
  return { l, c: c ?? 0, h: Number.isFinite(h) ? h : 0 };
}

/** CSS `oklch()` string, precise enough to round-trip to the same hex. */
export function formatOklch(color) {
  const { l, c, h } = oklchOf(color);
  const round = (value, digits) => Number(value.toFixed(digits));
  return `oklch(${round(l * 100, 3)}% ${round(c, 4)} ${round(h, 3)})`;
}

/**
 * Finds the OKLCH lightness whose sRGB color has `target` contrast with white.
 * Contrast with white rises as lightness falls, so a bisection converges.
 */
function solveStep(target, chroma, hue) {
  let low = 0;
  let high = 1;
  let hex = WHITE;

  for (let i = 0; i < 40; i += 1) {
    const lightness = (low + high) / 2;
    hex = formatHex(intoSrgb({ mode: 'oklch', l: lightness, c: chroma, h: hue }));
    if (contrast(hex, WHITE) > target) low = lightness;
    else high = lightness;
  }

  return hex;
}

/**
 * Generates a 50–950 scale.
 *
 * @param {object} options
 * @param {string} options.color - Input color; supplies hue and chroma.
 * @param {number} [options.chroma] - Fixed chroma for every step (used for neutrals).
 * @param {boolean} [options.pin] - Replace the nearest step with the exact input color.
 * @param {(step: number, hex: string) => boolean} [options.canPin] - Steps the input may
 *   replace; the nearest allowed step wins.
 * @returns {{ steps: Record<number, string>, pinnedStep: number|null }} Hex values by step.
 */
export function generateScale({ color, chroma, pin = false, canPin = () => true }) {
  const input = oklchOf(color);
  const steps = {};

  for (const step of STEPS) {
    const stepChroma = chroma ?? input.c * CHROMA_TAPER[step];
    steps[step] = solveStep(CONTRAST_TARGETS[step], stepChroma, input.h);
  }

  let pinnedStep = null;
  if (pin) {
    const hex = formatHex(color);
    const distance = (step) => Math.abs(Math.log(CONTRAST_TARGETS[step] / contrast(hex, WHITE)));
    pinnedStep = [...STEPS].sort((a, b) => distance(a) - distance(b)).find((step) => canPin(step, hex)) ?? null;
    if (pinnedStep !== null) steps[pinnedStep] = hex;
  }

  return { steps, pinnedStep };
}
