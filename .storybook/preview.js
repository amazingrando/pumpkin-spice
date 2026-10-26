/**
 * @file Storybook preview setup.
 *
 * Loads the shared stylesheet from source (not dist) so style edits show up
 * without rebuilding the styles package.
 */

import '../packages/styles/src/index.css';
import './storybook.css';

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
};

export default preview;
