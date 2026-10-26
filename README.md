# Pumpkin Spice Design System

Design tokens, React components, and Lit web components that share one CSS layer.

| Package | What it is |
| --- | --- |
| `@pumpkin-spice/tokens` | Design tokens generated from a client brand file: CSS custom properties, section themes, a Tailwind v4 theme, JSON/JS, and Figma (DTCG) files |
| `@pumpkin-spice/styles` | The shared stylesheet: tokens, base styles, and component styles. Authored with Tailwind, shipped as plain CSS. |
| `@pumpkin-spice/web-components` | Lit web components (`<psds-*>`) |
| `@pumpkin-spice/react` | React components |

## How it fits together

```text
packages/tokens/tokens/
  brand/<client>.json              The client brand kit: colors, fonts, radius, spacing
  base/, themes/                   Non-color tokens, prose, and section-theme mappings
        │  npm run tokens -- --brand=<client> [--prefix=acme]
        ├─▶ dist/css/tokens.css    Primitives, semantic tokens, section themes, prose
        ├─▶ dist/tailwind/theme.css   Semantic Tailwind theme (bg-primary, text-xl, rounded-control)
        └─▶ dist/json, dist/js, dist/figma   Resolved values and Figma import files

packages/styles/src/
  tailwind.css                     Tailwind + token theme, for @reference only
  base.css                         Global defaults and section-theme surfaces
  prose.css                        Rich text inside .prose
  components/<name>.css            Component styles on psds-* classes
  index.css                        Builds to dist/styles.css

packages/web-components/src/       Lit elements, light DOM, styled by psds-* classes
packages/react/src/                React components, same markup and classes
```

**Tokens.** Primitives are generated from the brand kit, semantic tokens use shadcn/ui names, and section themes (`.theme-light`, `-subtle`, `-dark`, `-brand`, `-accent`) remap them. The build fails if any semantic pair misses its contrast target. The full spec is in [docs/tokens.md](docs/tokens.md).

**Shared CSS.** React and web components render the same markup with the same `psds-*` classes, and all styling lives in `@pumpkin-spice/styles`. Web components render into the light DOM (`createRenderRoot() { return this; }`) so the shared CSS applies to them. React components can wrap the matching `<psds-*>` element for interactive behavior; React 19 passes props to custom elements as properties.

**Tailwind.** Component styles are written with Tailwind v4 `@apply`:

```css
/* packages/styles/src/components/button.css */
@reference "../tailwind.css";

.psds-button--primary {
  @apply bg-primary text-primary-foreground hover:bg-primary-hover;
}
```

- **Output is plain CSS.** The build compiles everything to `dist/styles.css`, so users of the packages don't need Tailwind, and the markup has no utility classes.
- **Only Pumpkin Spice tokens exist.** Tailwind's default colors, fonts, type scale, radii, and shadows are cleared, so utilities are semantic: `bg-primary`, `text-muted-foreground`, `rounded-control`. Spacing uses the brand kit's `spacing` unit, so `p-4` is 4 units.
- **Tailwind in your own app.** Apps that already use Tailwind can `@import "@pumpkin-spice/tokens/tailwind"` after `@import "tailwindcss"` to get the same utilities.

**Naming:** `psds-` prefixes CSS classes, custom properties, and custom elements. The npm scope is `@pumpkin-spice`.

## Develop

Requires Node.js 24.13 or newer (see `.nvmrc`).

```bash
npm install
npm run storybook
```

| Script | What it does |
| --- | --- |
| `npm run storybook` | Builds the tokens, then runs Storybook at http://localhost:6006 |
| `npm run tokens` | Rebuilds the tokens. Rerun after editing token JSON. |
| `npm run build` | Builds every package, in order: tokens, styles, web components, React |
| `npm run storybook-build` | Builds a static Storybook into `.out/` |

Storybook loads the shared styles from source with the Tailwind Vite plugin, so style edits hot-reload.

## Adding a component

1. **Styles:** add `packages/styles/src/components/<name>.css` using `psds-<name>` classes, and import it from `packages/styles/src/index.css`.
2. **Web component (if it needs behavior):** add a light-DOM Lit element in `packages/web-components/src/<name>/` and export it from `src/index.js`.
3. **React:** add `packages/react/src/<Name>/<Name>.jsx` rendering the same markup (or wrapping the `<psds-*>` element), and export it from `src/index.js`.
4. **Stories:** add `*.stories.jsx` next to each implementation. Lit elements render in stories as JSX custom elements.

## History

The project began as an Emulsify (Drupal) component system. That work is preserved in the `archive/emulsify-main`, `archive/tailwind-spike`, and `archive/tailwind-css-entries` tags.

## License

[MIT](./LICENSE)
