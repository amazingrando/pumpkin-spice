/**
 * @file Project Vite extensions, loaded by Emulsify Core for builds and Storybook.
 *
 * Tailwind runs as a PostCSS plugin rather than @tailwindcss/vite. Emulsify
 * only discovers .scss style entries, and Vite runs PostCSS after Sass, so
 * `@reference` and `@apply` inside component .scss files are compiled by
 * Tailwind. The Vite plugin only transforms .css files and would skip them.
 */

import tailwindcss from '@tailwindcss/postcss';

export default [];

export function extendConfig() {
  return {
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  };
}
