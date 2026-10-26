# Pumpkin Spice Design System

Design tokens, Drupal components, React components, and web components that all share one CSS layer.

- **Emulsify/Drupal:** install it as an [Emulsify](https://www.emulsify.info/) component system. Components are Drupal Single Directory Components (SDC).
- **React:** `@pumpkin-spice/react`
- **Web components (Lit):** `@pumpkin-spice/web-components`
- **Tokens only:** `@pumpkin-spice/tokens`, as CSS custom properties, Sass, JS, or JSON.

## How it fits together

```text
packages/tokens/tokens/*.json        Design tokens (W3C DTCG format), the source of truth
        │  npm run tokens (Style Dictionary)
        ├─▶ packages/tokens/dist/    CSS, Sass, JS, JSON for npm
        └─▶ src/foundation/_tokens.scss   --psds-* custom properties for Emulsify/Drupal

src/components/<name>/               One folder per component (the Emulsify system)
  <name>.twig                        Drupal/Twig markup
  <name>.component.yml               Drupal SDC metadata (props, slots)
  <name>.scss                        Shared CSS, also imported by React and the web components
  <name>.js                          Optional Lit web component for interactive behavior
  <name>.stories.js                  Twig stories

packages/react/                      React components: same markup and classes as the Twig
packages/web-components/             npm bundle of the Lit elements from src/components
```

**Shared CSS.** Every implementation renders the same markup with the same `psds-*` classes, and styles come only from the `--psds-*` token custom properties. Simple components such as Button are written once in Twig and once in React. Interactive components such as Disclosure get their behavior from a Lit element. That element renders into the light DOM, so the shared CSS applies, and Twig output works before JavaScript loads.

**Naming:**
- `psds-` is the prefix for CSS classes, custom properties, and custom elements.
- The Emulsify system name is `pumpkin-spice`.
- The npm scope is `@pumpkin-spice`.

## Develop

Requires Node.js 24.13 or newer (see `.nvmrc`).

```bash
npm install
npm run develop
```

`npm run develop` builds the tokens, then runs the Emulsify Vite watcher and Storybook at http://localhost:6006. Storybook shows the Twig, React, and web component versions of each component side by side, under `Components/<Name>/…`.

| Script | What it does |
| --- | --- |
| `npm run develop` | Builds tokens, then runs the Vite watch build and Storybook |
| `npm run tokens` | Rebuilds the tokens. The watcher doesn't track token JSON, so rerun this after editing it. |
| `npm run build` | Builds tokens, then runs the Emulsify production build (`dist/`, with Drupal SDC output mirrored to `components/`) |
| `npm run build:packages` | Builds the npm packages: tokens, web components, React |
| `npm run storybook-build` | Builds a static Storybook into `.out/` |

`components/` at the repo root is build output that Emulsify Core mirrors for Drupal SDC. It's git-ignored; edit `src/components/` instead.

## Use it in a Drupal project (Emulsify)

From an Emulsify Drupal theme:

```bash
emulsify system install --repository https://github.com/amazingrando/pumpkin-spice.git --checkout <tag>
```

This copies the components into the theme's `src/components/` and the tokens into `src/foundation/`. Then:

1. Attach the built `dist/global/foundation/css/foundation.css` globally in your theme's `*.libraries.yml`, so every component can read the `--psds-*` tokens.
2. If you use components that ship a web component (such as `disclosure`), add `lit` to the theme's `package.json`.

## Adding a component

1. Create `src/components/<name>/` with the Twig, `.component.yml`, `.scss`, and stories.
2. Register it in `system.emulsify.json` under `variants[0].components`.
3. For interactive behavior, add a light-DOM Lit element in `<name>.js` and export it from `packages/web-components/src/index.js`.
4. Add the React version in `packages/react/src/<Name>/`. Import the shared `.scss`, export it from `packages/react/src/index.js`, and add React stories.

## License

[MIT](./LICENSE)
