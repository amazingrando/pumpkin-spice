/**
 * @file Builds Pumpkin Spice design tokens. See docs/tokens.md.
 *
 *   node build.js [--brand=pumpkin-spice] [--prefix=acme]
 *
 * 1. Reads the client's brand inputs (tokens/brand/<brand>.json).
 * 2. Generates contrast-targeted color scales (primitives).
 * 3. Applies brand inputs and overrides to the base tokens and prose tokens.
 * 4. Resolves each section theme's semantic colors, including contrast-based
 *    picks, and fails the build if a required pair misses its contrast target.
 * 5. Writes CSS custom properties, a Tailwind theme, resolved JSON/JS, and
 *    DTCG files for Figma.
 *
 * Token names come from their path: `color.` is dropped and the rest is
 * kebab-joined, so `color.brand.600` is `--brand-600`, `color.primary` is
 * `--primary`, and `text.xl--line-height` is `--text-xl--line-height`.
 */

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { formatHex } from 'culori';
import { contrast, formatOklch, generateScale, STEPS, WHITE } from './lib/color.js';

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((arg) => arg.replace(/^--/, '').split('='))
    .map(([key, value = '']) => [key, value]),
);
const brandName = args.brand || 'pumpkin-spice';
const prefix = args.prefix || '';

const THEMES = {
  light: ':root, .theme-light',
  subtle: '.theme-subtle',
  dark: '.theme-dark, .dark',
  brand: '.theme-brand',
  accent: '.theme-accent',
};

/** Text pairs need 4.5:1; borders, inputs and focus rings need 3:1. */
const CONTRAST_PAIRS = [
  ['foreground', 'background'],
  ['card-foreground', 'card'],
  ['popover-foreground', 'popover'],
  ['muted-foreground', 'muted'],
  ['muted-foreground', 'background'],
  ['primary-foreground', 'primary'],
  ['primary-foreground', 'primary-hover'],
  ['secondary-foreground', 'secondary'],
  ['secondary-foreground', 'secondary-hover'],
  ['accent-foreground', 'accent'],
  ['destructive-foreground', 'destructive'],
  ['destructive-foreground', 'destructive-hover'],
  ['success-foreground', 'success'],
  ['warning-foreground', 'warning'],
  ['info-foreground', 'info'],
  ['destructive-subtle-foreground', 'destructive-subtle'],
  ['success-subtle-foreground', 'success-subtle'],
  ['warning-subtle-foreground', 'warning-subtle'],
  ['info-subtle-foreground', 'info-subtle'],
  ['link', 'background'],
  ['link-hover', 'background'],
  ['border-strong', 'background', 3],
  ['input', 'background', 3],
  ['ring', 'background', 3],
];

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url)));

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source ?? {})) {
    if (isObject(value) && isObject(target[key]) && !('$value' in value)) {
      deepMerge(target[key], value);
    } else if (isObject(target[key]) && '$value' in target[key] && !isObject(value)) {
      // Overrides may give a bare value for an existing token.
      target[key].$value = value;
    } else {
      target[key] = value;
    }
  }
  return target;
}

const tokenName = (path) => (path[0] === 'color' ? path.slice(1) : path).join('-');
const refName = (ref) => tokenName(ref.split('.'));
const cssVar = (name) => `--${prefix ? `${prefix}-` : ''}${name}`;
const REF = /\{([^}]+)\}/g;

/** Flattens a DTCG tree into Map<name, { path, value, type }>. */
function flatten(tree, path = [], inheritedType, out = new Map()) {
  const type = tree.$type ?? inheritedType;
  if ('$value' in tree) {
    out.set(tokenName(path), { path, value: tree.$value, type });
  }
  for (const [key, child] of Object.entries(tree)) {
    if (!key.startsWith('$') && isObject(child)) flatten(child, [...path, key], type, out);
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* 1–2. Brand inputs and primitives                                           */
/* -------------------------------------------------------------------------- */

const brand = await readJson(`./tokens/brand/${brandName}.json`);
const notes = [];

const primitives = new Map();
const addPrimitive = (name, value, extra = {}) =>
  primitives.set(name, { path: ['color', ...name.split('-')], value, type: 'color', ...extra });

addPrimitive('white', '#ffffff');
addPrimitive('black', '#000000');

const neutral = generateScale({ color: brand.color.brand, chroma: brand.color.neutralTint ?? 0.012 });

/** Best text contrast a color can get: white or near-black (neutral-950). */
const bestTextContrast = (hex) => Math.max(contrast(hex, WHITE), contrast(hex, neutral.steps[950]));

/** The solid-fill range (600–950) only accepts a brand color that passes 4.5:1 text. */
const canPin = (step, hex) => step < 600 || bestTextContrast(hex) >= 4.5;

const scales = {
  brand: generateScale({ color: brand.color.brand, pin: true, canPin }),
  accent: generateScale({ color: brand.color.accent, pin: true, canPin }),
  neutral,
  red: generateScale({ color: brand.color.status.danger }),
  amber: generateScale({ color: brand.color.status.warning }),
  green: generateScale({ color: brand.color.status.success }),
  blue: generateScale({ color: brand.color.status.info }),
};

for (const [family, { steps }] of Object.entries(scales)) {
  for (const step of STEPS) addPrimitive(`${family}-${step}`, steps[step]);
}

/**
 * The solid-fill step: the pinned brand color when it sits at 600–950 (which
 * `canPin` only allows when it passes 4.5:1 text); otherwise the generated 600.
 * Hover is one step darker, or one step lighter at the darkest step.
 */
for (const family of ['brand', 'accent']) {
  const { pinnedStep } = scales[family];
  const solid = pinnedStep >= 600 ? pinnedStep : 600;
  const hover = solid === 950 ? 900 : STEPS[STEPS.indexOf(solid) + 1];

  addPrimitive(`${family}-solid`, `{color.${family}.${solid}}`);
  addPrimitive(`${family}-solid-hover`, `{color.${family}.${hover}}`);

  notes.push(`${family}: ${brand.color[family]} pinned at ${family}-${pinnedStep}; solid fill is ${family}-${solid}.`);
  if (solid !== pinnedStep) {
    notes.push(
      `  The exact ${family} color is too light for solid fills with 4.5:1 text, so primary and ${family} sections use the generated ${family}-600.`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* 3. Base and prose tokens                                                   */
/* -------------------------------------------------------------------------- */

const baseTree = await readJson('./tokens/base/base.json');
deepMerge(baseTree, {
  font: {
    sans: { $value: brand.font.sans },
    serif: { $value: brand.font.serif },
    mono: { $value: brand.font.mono },
    heading: { $value: `{font.${brand.font.heading}}` },
    body: { $value: `{font.${brand.font.body}}` },
  },
  radius: { $value: brand.radius },
  spacing: { $value: brand.spacing },
  'container-max': { $value: brand.containerMax },
});
deepMerge(baseTree, brand.overrides);

const base = flatten(baseTree);
const prose = flatten(await readJson('./tokens/base/prose.json'));

/* -------------------------------------------------------------------------- */
/* 4. Section themes                                                          */
/* -------------------------------------------------------------------------- */

const themes = {};
for (const theme of Object.keys(THEMES)) {
  themes[theme] = flatten(await readJson(`./tokens/themes/${theme}.json`));
}

/** Looks a name up in a theme, falling back to light, base and primitives. */
function lookup(name, theme) {
  return (
    themes[theme]?.get(name) ??
    themes.light.get(name) ??
    base.get(name) ??
    prose.get(name) ??
    primitives.get(name)
  );
}

/** Resolves a token's value to a literal (hex for colors), following refs and picks. */
function resolveValue(value, theme, seen = new Set()) {
  if (isObject(value) && value.pick) return resolveValue(choosePick(value, theme), theme, seen);
  if (typeof value !== 'string') return value;

  const whole = value.match(/^\{([^}]+)\}$/);
  if (whole) {
    const name = refName(whole[1]);
    if (seen.has(name)) throw new Error(`Circular reference at ${name}`);
    const token = lookup(name, theme);
    if (!token) throw new Error(`Unknown token reference {${whole[1]}} in theme ${theme}`);
    return resolveValue(token.value, theme, new Set([...seen, name]));
  }

  return value.replace(REF, (_, ref) => String(resolveValue(`{${ref}}`, theme, seen)));
}

const pickCache = new Map();

/**
 * Chooses the first candidate reaching `min` contrast against every surface in
 * `against`, falling back to the candidate with the best worst-case contrast.
 */
function choosePick(pick, theme) {
  const key = `${theme}:${JSON.stringify(pick)}`;
  if (pickCache.has(key)) return pickCache.get(key);

  const surfaces = pick.against.map((name) => resolveValue(`{color.${name}}`, theme));
  const scored = pick.pick.map((ref) => {
    const hex = resolveValue(ref, theme);
    return { ref, worst: Math.min(...surfaces.map((surface) => contrast(hex, surface))) };
  });
  const chosen =
    scored.find((candidate) => candidate.worst >= pick.min) ??
    scored.reduce((best, candidate) => (candidate.worst > best.worst ? candidate : best));

  pickCache.set(key, chosen.ref);
  return chosen.ref;
}

// Replace picks with the chosen reference so outputs stay references.
for (const [theme, tokens] of Object.entries(themes)) {
  for (const token of tokens.values()) {
    if (isObject(token.value) && token.value.pick) token.value = choosePick(token.value, theme);
  }
}

const failures = [];
for (const theme of Object.keys(THEMES)) {
  for (const [fg, bg, min = 4.5] of CONTRAST_PAIRS) {
    const ratio = contrast(resolveValue(`{color.${fg}}`, theme), resolveValue(`{color.${bg}}`, theme));
    if (ratio < min) failures.push(`${theme}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1 (needs ${min}:1)`);
  }
}

/* -------------------------------------------------------------------------- */
/* 5. Outputs                                                                 */
/* -------------------------------------------------------------------------- */

const fontStack = (families) =>
  families.map((family) => (/[\s,]/.test(family) ? `"${family}"` : family)).join(', ');

/** CSS value for a token: references become var(), literal colors become oklch(). */
function cssValue(token) {
  const { value, type } = token;
  if (Array.isArray(value)) return fontStack(value);
  if (typeof value !== 'string') return String(value);
  if (type === 'color' && !value.includes('{')) return formatOklch(value);
  return value.replace(REF, (_, ref) => `var(${cssVar(refName(ref))})`);
}

const declarations = (tokens) =>
  [...tokens].map(([name, token]) => `  ${cssVar(name)}: ${cssValue(token)};`).join('\n');

const usesThemeColor = (token) =>
  typeof token.value === 'string' &&
  [...token.value.matchAll(REF)].some(([, ref]) => themes.light.has(refName(ref)));

const proseStatic = [...prose].filter(([, token]) => !usesThemeColor(token));
const proseThemed = [...prose].filter(([, token]) => usesThemeColor(token));

const header = (lines) => `/**\n${lines.map((line) => ` * ${line}`).join('\n')}\n */`;
const generated = [
  `Pumpkin Spice design tokens: ${brand.name} (${brandName}).`,
  'Generated by packages/tokens/build.js. Do not edit directly; see docs/tokens.md.',
];

const css = [
  header(generated),
  `:root {\n  /* Primitives */\n${declarations(primitives)}\n\n  /* Base */\n${declarations(base)}\n\n  /* Prose */\n${declarations(proseStatic)}\n}`,
  ...Object.entries(THEMES).map(
    ([theme, selector]) => `/* Section theme: ${theme} */\n${selector} {\n${declarations(themes[theme])}\n}`,
  ),
  // Declared on every theme selector so they re-resolve against that theme.
  `/* Theme-dependent prose colors */\n${Object.values(THEMES).join(',\n')} {\n${declarations(proseThemed)}\n}`,
].join('\n\n');

const semanticColors = [...themes.light.keys()];
const twMap = (twName, name) => `  --${twName}: var(${cssVar(name)});`;
const tailwind = [
  header([
    ...generated,
    'Tailwind v4 theme: semantic tokens only. `reference` keeps Tailwind from',
    'declaring its own variables; utilities read the token variables directly.',
  ]),
  '@custom-variant dark (&:where(.dark, .dark *, .theme-dark, .theme-dark *));\n',
  '@theme inline reference {',
  ...['color', 'font', 'font-weight', 'text', 'leading', 'tracking', 'radius', 'shadow', 'ease'].map(
    (namespace) => `  --${namespace}-*: initial;`,
  ),
  ...semanticColors.map((name) => twMap(`color-${name}`, name)),
  ...['sans', 'serif', 'mono', 'heading', 'body'].map((name) => twMap(`font-${name}`, `font-${name}`)),
  ...[...base.keys()]
    .filter((name) => /^(font-weight|text|leading|tracking|shadow|ease)-/.test(name))
    .map((name) => twMap(name, name)),
  ...['sm', 'md', 'lg', 'xl', 'control', 'container'].map((size) => twMap(`radius-${size}`, `radius-${size}`)),
  twMap('spacing', 'spacing'),
  '}',
  '',
].join('\n');

const resolveAll = (tokens, theme = 'light') =>
  Object.fromEntries([...tokens].map(([name, token]) => [name, resolveValue(token.value, theme)]));

const resolved = {
  brand: { id: brandName, name: brand.name, prefix },
  primitives: resolveAll(primitives),
  base: resolveAll(base),
  prose: resolveAll(proseStatic),
  themes: Object.fromEntries(
    Object.keys(THEMES).map((theme) => [
      theme,
      Object.fromEntries(semanticColors.map((name) => [name, resolveValue(`{color.${name}}`, theme)])),
    ]),
  ),
};

/** DTCG for Figma: hex values, aliases kept as references. */
function dtcgTree(tokens, theme) {
  const tree = {};
  for (const [name, token] of tokens) {
    let value = token.value;
    if (isObject(value)) value = resolveValue(value, theme);
    if (token.type === 'color' && typeof value === 'string' && !value.includes('{')) value = formatHex(value);
    if (Array.isArray(value)) value = fontStack(value);
    tree[name] = { $value: value, ...(token.type ? { $type: token.type } : {}) };
  }
  return tree;
}

const outputs = {
  'dist/css/tokens.css': `${css}\n`,
  'dist/tailwind/theme.css': tailwind,
  'dist/json/tokens.json': `${JSON.stringify(resolved, null, 2)}\n`,
  'dist/js/tokens.js': `${header(generated)}\nexport default ${JSON.stringify(resolved, null, 2)};\n`,
  'dist/figma/primitives.tokens.json': `${JSON.stringify(dtcgTree(primitives, 'light'), null, 2)}\n`,
  'dist/figma/base.tokens.json': `${JSON.stringify(dtcgTree(new Map([...base, ...proseStatic]), 'light'), null, 2)}\n`,
  ...Object.fromEntries(
    Object.keys(THEMES).map((theme) => [
      `dist/figma/semantic.${theme}.tokens.json`,
      `${JSON.stringify(dtcgTree(themes[theme], theme), null, 2)}\n`,
    ]),
  ),
};

await rm(new URL('./dist', import.meta.url), { recursive: true, force: true });
for (const [path, content] of Object.entries(outputs)) {
  const url = new URL(`./${path}`, import.meta.url);
  await mkdir(dirname(url.pathname), { recursive: true });
  await writeFile(url, content);
}

console.log(`Built tokens for ${brand.name}${prefix ? ` with prefix "${prefix}"` : ''}.`);
for (const note of notes) console.log(note);
console.log(`Wrote ${Object.keys(outputs).map((path) => join('packages/tokens', path)).join(', ')}`);

if (failures.length) {
  console.error(`\nContrast check failed (${failures.length}):`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Contrast check passed: ${CONTRAST_PAIRS.length} pairs × ${Object.keys(THEMES).length} themes.`);
}
