/**
 * @file Storybook preview setup.
 *
 * Loads the shared stylesheet from source (not dist) so style edits show up
 * without rebuilding the styles package. The toolbar theme switcher puts a
 * section-theme class on <html>, which remaps the semantic tokens for every
 * story.
 */

import { withThemeByClassName } from '@storybook/addon-themes';
import '../packages/styles/src/index.css';
import './storybook.css';

/** Section themes from docs/tokens.md: toolbar name → class. */
export const THEMES = {
  light: 'theme-light',
  subtle: 'theme-subtle',
  dark: 'theme-dark',
  brand: 'theme-brand',
  accent: 'theme-accent',
};

/** @type {import('@storybook/react-vite').Preview} */
const preview = {
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: THEMES,
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
  ],
};

export default preview;
