# Pumpkin Spice Design System

Design tokens, React components, and Lit web components that share one CSS layer.

| Package | What it is |
| --- | --- |
| `@pumpkin-spice/tokens` | Design tokens as CSS custom properties, JS, JSON, and a Tailwind v4 theme |
| `@pumpkin-spice/styles` | The shared stylesheet: tokens, base styles, and component styles. Authored with Tailwind, shipped as plain CSS. |
| `@pumpkin-spice/web-components` | Lit web components (`<psds-*>`) |
| `@pumpkin-spice/react` | React components |

## How it fits together

```text
packages/tokens/tokens/*.json      Design tokens (W3C DTCG format), the source of truth
        │  Style Dictionary
        ├─▶ dist/css/tokens.css    --psds-* custom properties
        └─▶ dist/tailwind/theme.css   Tailwind @theme mapped onto --psds-*

packages/styles/src/
  tailwind.css                     Tailwind + token theme, for @reference only
  base.css                         Global defaults
  components/<name>.css            Component styles on psds-* classes
  index.css                        Builds to dist/styles.css

packages/web-components/src/       Lit elements, light DOM, styled by psds-* classes
packages/react/src/                React components, same markup and classes
```

**Shared CSS.** React and web components render the same markup with the same `psds-*` classes, and all styling lives in `@pumpkin-spice/styles`. Web components render into the light DOM (`createRenderRoot() { return this; }`) so the shared CSS applies to them. React components can wrap the matching `<psds-*>` element for interactive behavior; React 19 passes props to custom elements as properties.

**Tailwind.** Component styles are written with Tailwind v4 `@apply`:

```css
/* packages/styles/src/components/button.css */
@reference "../tailwind.css";

.psds-button--primary {
  @apply bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover;
}
```

- **Output is plain CSS.** The build compiles everything to `dist/styles.css`, so users of the packages don't need Tailwind, and the markup has no utility classes.
- **Only Pumpkin Spice tokens exist.** Tailwind's default colors, radii, and type scale are cleared. Spacing uses `--psds-space-1` as the base unit, so `p-4` is `--psds-space-4`.
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
