# Pumpkin Spice token spec

Pumpkin Spice is a starter that gets re-themed per client. A client theme is a small brand file. Everything else is generated from it or maps onto it, so designs and components never change between clients.

```text
brand inputs ──▶ primitives (generated) ──▶ semantic tokens ──▶ section themes remap them
  one file          color scales, type,         role names            light · subtle · dark · brand · accent
  per client        radius, spacing             + extensions          (classes)
                                                                        │
                                                 component hooks ◀──────┘  (code only, never in Figma)
```

## 1. Brand inputs

`packages/tokens/tokens/brand/<client>.json` is the only file edited per client. Build a client with `npm run tokens -- --brand=<client>`.

| Key | Meaning |
| --- | --- |
| `name` | Display name of the brand |
| `color.brand` | Primary brand color (hex). Required. |
| `color.accent` | Secondary brand color (hex). Required. |
| `color.neutralTint` | OKLCH chroma for grays tinted with the brand hue. `0` = pure gray. Default `0.012`. |
| `color.status.{danger,warning,success,info}` | Status hues (hex). Defaults are provided; override per client. |
| `font.{sans,serif,mono}` | Font family stacks |
| `font.heading`, `font.body` | Which family each role uses: `sans`, `serif`, or `mono` |
| `radius` | Base radius. Every radius token derives from it. |
| `spacing` | Tailwind spacing unit (density). `p-4` = 4 × this. |
| `containerMax` | Maximum page container width |
| `overrides` | Optional. Any base token by path, for example `{ "text": { "base": "1.0625rem" } }`. |

## 2. Primitives (generated)

Never edited by hand. The build computes them from the brand inputs.

### Color scales

`brand`, `accent`, `neutral`, `red`, `amber`, `green`, `blue`, each with steps `50`–`950`, plus `white` and `black`.

Steps are generated to **contrast targets** against white, so a step does the same job for every hue:

| Step | Contrast vs white | Job |
| --- | --- | --- |
| 50 | 1.05 | lightest background tint |
| 100 | 1.12 | subtle background |
| 200 | 1.3 | subtle background, hover |
| 300 | 1.6 | subtle border |
| 400 | 2.2 | border, decorative |
| 500 | 3.2 | solid fill, alternate; UI contrast (3:1) |
| 600 | 4.7 | **solid fill (default)**; AA text (4.5:1) |
| 700 | 6.2 | solid fill, hover |
| 800 | 8.2 | text with lower contrast; AAA (7:1) |
| 900 | 12 | text with high contrast |
| 950 | 16 | darkest background |

- **Hue and chroma:** scales keep the input's hue. Chroma follows the input, tapering toward the lightest and darkest steps, and is clamped to the sRGB gamut.
- **Neutral:** uses the brand hue at `neutralTint` chroma.
- **Pinning:** the client's exact `brand` and `accent` hex values replace their nearest step, so the brand color appears unchanged in the scale. A color can only pin into the solid range (`600`–`950`) when it reaches 4.5:1 with white or near-black text. Otherwise it pins to the nearest lighter step. Pure red `#ff0000`, at 4.0:1 with white, pins to `500`.
- **Solid step:** `brand-solid` and `accent-solid` are the steps used for solid fills (`primary`, brand sections). They're the pinned step when it's in `600`–`950`, so dark brands like navy keep their exact color, and the generated `600` otherwise. `brand-solid-hover` and `accent-solid-hover` are one step darker, or one step lighter when the solid step is `950`. When the exact brand color isn't the solid fill, the build prints a note explaining why.

### Non-color primitives

| Group | Tokens |
| --- | --- |
| Font families | `font-sans`, `font-serif`, `font-mono` |
| Font weights | `font-weight-regular` 400, `-medium` 500, `-semibold` 600, `-bold` 700 |
| Type scale | `text-xs` … `text-9xl` (Tailwind's sizes), each with `text-*--line-height` |
| Line height | `leading-tight` 1.2, `-snug` 1.375, `-normal` 1.5, `-relaxed` 1.625 |
| Letter spacing | `tracking-tight` -0.025em, `-normal` 0, `-wide` 0.025em |
| Radius | `radius` (base); `radius-sm` = base − 4px, `-md` = base − 2px, `-lg` = base, `-xl` = base + 4px |
| Shadows | `shadow-sm`, `shadow-md`, `shadow-lg` |
| Motion | `duration-fast` 100ms, `-normal` 200ms, `-slow` 300ms; `ease-standard`, `ease-emphasized` |
| Layout | `spacing` (unit), `container-max` |

The type scale uses Tailwind's default values:

| Size | rem | line height | Size | rem | line height |
| --- | --- | --- | --- | --- | --- |
| `xs` | 0.75 | 1rem | `4xl` | 2.25 | 2.5rem |
| `sm` | 0.875 | 1.25rem | `5xl` | 3 | 1 |
| `base` | 1 | 1.5rem | `6xl` | 3.75 | 1 |
| `lg` | 1.125 | 1.75rem | `7xl` | 4.5 | 1 |
| `xl` | 1.25 | 1.75rem | `8xl` | 6 | 1 |
| `2xl` | 1.5 | 2rem | `9xl` | 8 | 1 |
| `3xl` | 1.875 | 2.25rem | | | |

## 3. Semantic tokens

Designs and components use only these. Each surface color is paired with a `-foreground` color for text and icons on top of it.

### Colors (remapped by section themes)

| Group | Tokens |
| --- | --- |
| Page | `background`, `foreground` |
| Containers | `card`, `card-foreground`, `popover`, `popover-foreground` |
| Quiet | `muted`, `muted-foreground` |
| Actions | `primary`, `primary-foreground`, `primary-hover`, `secondary`, `secondary-foreground`, `secondary-hover` |
| Highlight | `accent`, `accent-foreground` (hover/selected background for menu items and ghost buttons, not the accent brand color) |
| Danger | `destructive`, `destructive-foreground`, `destructive-hover` |
| Status | `success`, `warning`, `info`, each with `-foreground` |
| Soft status | `destructive-subtle`, `success-subtle`, `warning-subtle`, `info-subtle`, each with `-foreground` |
| Links | `link`, `link-hover` |
| Lines | `border`, `border-strong`, `input`, `ring` |

Not included: sidebar and chart tokens. Add them when a project needs them.

### Other semantic tokens (the same in every theme)

| Group | Tokens |
| --- | --- |
| Font roles | `font-heading`, `font-body` |
| Radius by usage | `radius-control` → `radius-md`, `radius-container` → `radius-lg` |
| Shadows by height | `shadow-raised` → `shadow-sm`, `shadow-overlay` → `shadow-lg` |
| Section spacing | `space-section` (12 units), `space-section-inner` (8 units) |
| Focus | `ring-width` 2px, `ring-offset` 2px |

### Prose (applies inside `.prose` only)

Each element has `--prose-{el}-font`, `-size`, `-leading`, `-weight`, `-tracking`, `-space-before`, `-space-after`. Sizes point at the type scale, and spacing is in multiples of the spacing unit.

| Element | Size | Leading | Weight | Tracking | Before / after (units) |
| --- | --- | --- | --- | --- | --- |
| `h1` | `4xl` | tight | semibold | tight | 0 / 6 |
| `h2` | `3xl` | tight | semibold | tight | 10 / 4 |
| `h3` | `2xl` | snug | semibold | normal | 8 / 3 |
| `h4` | `xl` | snug | semibold | normal | 6 / 2 |
| `h5` | `lg` | snug | semibold | normal | 6 / 2 |
| `h6` | `base` | normal | semibold | normal | 6 / 2 |
| `p` | `base` | relaxed | regular | normal | 0 / 5 |
| `lead` | `xl` | relaxed | regular | normal | 0 / 6 |
| `small` | `sm` | normal | regular | normal | — |
| `blockquote` | `lg` | relaxed | regular | normal | 6 / 6 |
| `list` (ul/ol) | inherits `p` | relaxed | — | — | 0 / 5, item gap 2 |
| `code` (inline) | `sm` | — | medium | — | — |
| `pre` | `sm` | relaxed | regular | — | 6 / 6 |
| `figcaption` | `sm` | normal | regular | — | 3 / 0 |
| `hr` | — | — | — | — | 10 / 10 |

- **Fonts:** headings use `font-heading`, text uses `font-body`, and `code` and `pre` use `font-mono`.
- **Colors** follow the section theme:

| Token | Maps to |
| --- | --- |
| `prose-heading` | `foreground` |
| `prose-body` | `foreground` |
| `prose-muted` | `muted-foreground` |
| `prose-link` | `link` |
| `prose-link-hover` | `link-hover` |
| `prose-quote-border` | `border-strong` |
| `prose-code-bg` | `muted` |
| `prose-pre-bg` | `muted` |
| `prose-marker` | `muted-foreground` |

There's no responsive type yet: each element has one size.

## 4. Section themes

Classes remap the semantic colors for an element and everything inside it:

| Class | Use |
| --- | --- |
| `:root`, `.theme-light` | Default page |
| `.theme-subtle` | Softly tinted band |
| `.theme-dark`, `.dark` | Dark band. Tailwind's `dark:` variant applies inside either class. |
| `.theme-brand` | Brand-colored band |
| `.theme-accent` | Accent-colored band |

- **No site-wide dark mode:** `.theme-dark` is for sections only.
- **Status colors:** offered in light, subtle, and dark. Inside brand and accent sections they inherit from the surrounding theme.
- **Figma:** each theme is a mode of the Semantic collection, so setting a frame's mode is equivalent to adding the class.

The exact step mappings live in `packages/tokens/tokens/themes/*.json`.

**Contrast checks.** The build fails unless:
- every text pair (`*-foreground` on its surface, `link` on `background`, `muted-foreground` on `muted` and `background`) reaches 4.5:1;
- `border-strong`, `input` and `ring` reach 3:1 against `background`.

## 5. Component hooks (code only)

Use `--{component}-{property}` custom properties only where the semantic layer can't express something. They default to semantic tokens, for example `.psds-button { --button-radius: var(--radius-control); }`. They never appear in Figma.

## 6. Output

| File | Contents |
| --- | --- |
| `dist/css/tokens.css` | All CSS custom properties: primitives (OKLCH), semantic tokens, the five section themes, and prose |
| `dist/tailwind/theme.css` | `@theme inline reference` mapping: semantic colors, fonts, type, leading, tracking, radius, shadows, spacing. Primitive scales aren't exposed, and Tailwind's defaults for those namespaces are cleared. |
| `dist/js/tokens.js`, `dist/json/tokens.json` | Resolved values (hex) for scripts and docs |
| `dist/figma/*.tokens.json` | W3C format (DTCG) with hex values: `primitives`, `base`, and one `semantic.<theme>` file per mode, with aliases to primitives |

- **Naming:** semantic colors use role names (`--primary`), primitive colors are named by scale (`--brand-600`), and non-color tokens use Tailwind's names (`--text-xl`, `--radius-md`).
- **Prefix:** optional, and off by default. `npm run tokens -- --prefix=acme` emits `--acme-primary`, `--acme-brand-600`, and so on, and the Tailwind mapping follows. The prose styles in `@pumpkin-spice/styles` still expect unprefixed names.

## Figma

- **Source of truth:** this repo. Push into Figma with Figma's variable import, or Tokens Studio or TokensBruecke if needed. Changes made in Figma come back through a pull request.
- **Collections:**
  - **Primitives:** 1 mode.
  - **Semantic:** 5 modes, one per theme.
  - **Base:** 1 mode (type, radius, spacing).
- **Text styles:** the prose set (`Prose/H1` … `Prose/Code`), bound to type variables.
- **Per client:** each client gets its own copy of the library with its primitives swapped.
