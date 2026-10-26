/**
 * @file Project Vite extensions, loaded by Emulsify Core for builds and Storybook.
 *
 * Component styles are plain .css (enabled by `styles.cssEntries` in
 * project.emulsify.json), so the standard Tailwind Vite plugin compiles
 * their `@reference` and `@apply` rules.
 */

import tailwindcss from '@tailwindcss/vite';

export default [tailwindcss()];
