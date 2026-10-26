/**
 * @file Project Storybook overrides, loaded by Emulsify Core's shared config.
 *
 * Emulsify discovers Twig stories in src/components. This adds the React and
 * web component stories from the npm workspace packages, so all three
 * implementations appear side by side in one Storybook.
 */

import path from 'node:path';

const projectDir = path.resolve(import.meta.dirname, '../../..');

export function extendConfig(config) {
  return {
    ...config,
    stories: [
      ...config.stories,
      path.join(projectDir, 'packages/*/src/**/*.stories.@(js|jsx)'),
    ],
  };
}
